#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);



const char* HeadIndex = "home/sensors/TempHumid";
const char* TempHumidTopic = "home/command/Temp";  // Topic to subscribe to
const char* RelayTopic = "home/command/Relay";

String readTempHumid() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return "";
  }
  String JSON_Data = "{\"temp\":" + String(t) + ",\"hum\":" + String(h) + "}";
  return JSON_Data;
}

// MQTT callback function for received messages
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");

  // Convert payload to string
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (String(topic) == TempHumidTopic) {
    if (message == "get_TempHumid") {
      String tempHumid = readTempHumid();
      if (tempHumid != "") {
        mqttClient.publish(HeadIndex, tempHumid.c_str());
      }
    }
  }

  else if (String(topic) == RelayTopic) {
    if (message == "{\"id\":\"Relay1\",\"state\":\"ON\"}") {
      Serial.println("Turn on relay 1");
    } else if (message == "{\"id\":\"Relay1\",\"state\":\"OFF\"}") {
      Serial.println("Turn off relay 1"); // Fixed: was saying relay 2
    } else if (message == "{\"id\":\"Relay2\",\"state\":\"ON\"}") {
      Serial.println("Turn on relay 2");
    }
  }
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.println("Connecting to MQTT...");
    if (mqttClient.connect("ESP32Client")) {
      Serial.println("Connected to MQTT");
      // Subscribe to topic after connection
      mqttClient.subscribe(TempHumidTopic);
      mqttClient.subscribe(RelayTopic);

    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  mqttClient.setServer(mqttBroker, mqttPort);
  mqttClient.setCallback(callback);  // Set the callback function

  reconnect();  // Connect and subscribe
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();  // Maintain MQTT connection and process incoming messages

  static unsigned long lastPublish = 0;
  if (millis() - lastPublish >= 5000) {  // Publish every 5 seconds
    lastPublish = millis();
    String tempHumid = readTempHumid();
    if (tempHumid != "") {
      Serial.println(tempHumid);
      mqttClient.publish(HeadIndex, tempHumid.c_str());
    }
  }
}