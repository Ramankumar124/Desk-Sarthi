#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <WiFiClientSecure.h>
#include "secrets.h"
#include <IrRemoteControll.h>
// Define pins and constants before including custom headers
#define DHTPIN 5
#define DHTTYPE DHT11
#define IRremoteReciverPin 4 // Set IR receiver on pin 14 (adjust as needed)
// Use const int instead of #define for relay pins so they can be used with extern
const int Relay1 = 33;
const int Relay2 = 25;
const int Relay3 = 26;
const int Relay4 = 27;

DHT dht(DHTPIN, DHTTYPE);
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

// Now include custom headers after definitions are made
#include "IrRemoteControll.h"
#include "rgbaRing.h"
#include "mqtt.h"

String readTempHumid()
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t))
  {
    Serial.println(F("Failed to read from DHT sensor!"));
    return "";
  }
  String JSON_Data = "{\"temp\":" + String(t) + ",\"hum\":" + String(h) + "}";
  return JSON_Data;
}

void setup()
{
  Serial.begin(115200);
  randomSeed(analogRead(0)); // Initialize random number generator for random colors
  dht.begin();
  pinMode(Relay1, OUTPUT);
  pinMode(Relay2, OUTPUT);
  pinMode(Relay3, OUTPUT);
  pinMode(Relay4, OUTPUT);
  digitalWrite(Relay1, HIGH);
  digitalWrite(Relay2, HIGH);
  digitalWrite(Relay3, HIGH);
  digitalWrite(Relay4, HIGH);
  WiFi.begin(ssid, password);
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  wifiClient.setCACert(root_ca);
  mqttClient.setServer(mqttBroker, mqttPort);
  mqttClient.setCallback(callback); // Set the callback function
  reconnect();                      // Connect to mqtt and subscribe
  IrReceiver.begin(IRremoteReciverPin, ENABLE_LED_FEEDBACK);
}

void loop()
{
  if (!mqttClient.connected())
  {
    reconnect();
  }
  mqttClient.loop(); // Maintain MQTT connection and process incoming messages

  // Check for IR remote commands
  IrRemoteReciver();

  static unsigned long lastPublish = 0;
  if (millis() - lastPublish >= 60000)
  { // Publish every minute
    lastPublish = millis();
    String tempHumid = readTempHumid();
    if (tempHumid != "")
    {
      Serial.println(tempHumid);
      mqttClient.publish(HeadIndex, tempHumid.c_str());
    }
  }
  //  Update LED animations
  updateLEDAnimation();
}