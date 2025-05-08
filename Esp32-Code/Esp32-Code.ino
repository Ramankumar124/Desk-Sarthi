#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <WiFiClientSecure.h>
#include <secrets.h>
#include <ArduinoJson.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define Relay1 16
#define Relay2 17
#define Relay3 5
#define Relay4 18

DHT dht(DHTPIN, DHTTYPE);
WiFiClientSecure  wifiClient;
PubSubClient mqttClient(wifiClient);

const char *HeadIndex = "home/sensors/TempHumid";
const char *TempHumidTopic = "home/command/Temp";
const char *RelayTopic = "home/command/Relay";
const char *relayStatus="home/sensors/relayState";
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

// MQTT callback function for received messages
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");

  // Convert payload to string
  String message;
  for (int i = 0; i < length; i++)
  {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (String(topic) == TempHumidTopic)
  {
    if (message == "get_TempHumid")
    {
      String tempHumid = readTempHumid();
      if (tempHumid != "")
      {
        mqttClient.publish(HeadIndex, tempHumid.c_str());
      }
    }
  }

  else if (String(topic) == relayStatus)
  {
    Serial.println("Received relay state update");

    // Parse JSON using ArduinoJson
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error)
    {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }

    // Extract relay states from JSON and update pins
    const char *relay1State = doc["relay1"];
    const char *relay2State = doc["relay2"];
    const char *relay3State = doc["relay3"];
    const char *relay4State = doc["relay4"];

    // Set Relay1 state
    if (strcmp(relay1State, "ON") == 0)
    {
      digitalWrite(Relay1, LOW);
      Serial.println("Turn on relay 1");
    }
    else if (strcmp(relay1State, "OFF") == 0)
    {
      digitalWrite(Relay1, HIGH);
      Serial.println("Turn off relay 1");
    }

    // Set Relay2 state
    if (strcmp(relay2State, "ON") == 0)
    {
      digitalWrite(Relay2, LOW);
      Serial.println("Turn on relay 2");
    }
    else if (strcmp(relay2State, "OFF") == 0)
    {
      digitalWrite(Relay2, HIGH);
      Serial.println("Turn off relay 2");
    }

    // Set Relay3 state
    if (strcmp(relay3State, "ON") == 0)
    {
      digitalWrite(Relay3, LOW);
      Serial.println("Turn on relay 3");
    }
    else if (strcmp(relay3State, "OFF") == 0)
    {
      digitalWrite(Relay3, HIGH);
      Serial.println("Turn off relay 3");
    }

    // Set Relay4 state
    if (strcmp(relay4State, "ON") == 0)
    {
      digitalWrite(Relay4, LOW);
      Serial.println("Turn on relay 4");
    }
    else if (strcmp(relay4State, "OFF") == 0)
    {
      digitalWrite(Relay4, HIGH);
      Serial.println("Turn off relay 4");
    }

  
  }
  else if (String(topic) == RelayTopic)
  {
    mqttClient.publish("device/status/relay", message.c_str());
    if (message == "{\"id\":\"Relay1\",\"state\":\"ON\"}")
    {
      digitalWrite(Relay1, LOW);
      Serial.println("Turn on relay 1");
    }
    else if (message == "{\"id\":\"Relay1\",\"state\":\"OFF\"}")
    {
      digitalWrite(Relay1, HIGH);
      Serial.println("Turn off relay 1");
    }
    else if (message == "{\"id\":\"Relay2\",\"state\":\"ON\"}")
    {
      digitalWrite(Relay2, LOW);
      Serial.println("Turn on relay 2");
    }
    else if (message == "{\"id\":\"Relay2\",\"state\":\"OFF\"}")
    {
      digitalWrite(Relay2, HIGH);
      Serial.println("Turn off relay 2");
    }
    else if (message == "{\"id\":\"Relay3\",\"state\":\"ON\"}")
    {
      digitalWrite(Relay3, LOW);
      Serial.println("Turn on relay 3");
    }
    else if (message == "{\"id\":\"Relay3\",\"state\":\"OFF\"}")
    {
      digitalWrite(Relay3, HIGH);
      Serial.println("Turn off relay 3");
    }
    else if (message == "{\"id\":\"Relay4\",\"state\":\"ON\"}")
    {
      digitalWrite(Relay4, LOW);
      Serial.println("Turn on relay 4");
    }
    else if (message == "{\"id\":\"Relay4\",\"state\":\"OFF\"}")
    {
      digitalWrite(Relay4, HIGH);
      Serial.println("Turn off relay 4");
    }
  }
}

void reconnect()
{
  while (!mqttClient.connected())
  {
    Serial.println("Connecting to MQTT...");
    if (mqttClient.connect("ESP32Client",mqtt_username, mqtt_password))
    {
      mqttClient.publish("Esp32Connected", "your Esp32 is connected");
      Serial.println("Connected to MQTT");
      mqttClient.subscribe(relayStatus);
      mqttClient.subscribe(TempHumidTopic);
      mqttClient.subscribe(RelayTopic);
      Serial.println("subscribed ");
    }
    else
    {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(115200);
  dht.begin();

  // Initialize relay pins as outputs
  pinMode(Relay1, OUTPUT);
  pinMode(Relay2, OUTPUT);
  pinMode(Relay3, OUTPUT);
  pinMode(Relay4, OUTPUT);
  digitalWrite(Relay1, HIGH);
  digitalWrite(Relay2, HIGH);
  digitalWrite(Relay3, HIGH);
  digitalWrite(Relay4, HIGH);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
 wifiClient.setCACert(root_ca);
  mqttClient.setServer(mqttBroker, mqttPort);
  mqttClient.setCallback(callback); // Set the callback function

  reconnect(); // Connect and subscribe
}

void loop()
{
  if (!mqttClient.connected())
  {
    reconnect();
  }
  mqttClient.loop(); // Maintain MQTT connection and process incoming messages

  static unsigned long lastPublish = 0;
  if (millis() - lastPublish >= 60000)
  { // Publish every 5 seconds
    lastPublish = millis();
    String tempHumid = readTempHumid();
    if (tempHumid != "")
    {
      Serial.println(tempHumid);
      mqttClient.publish(HeadIndex, tempHumid.c_str());
    }
  }
}