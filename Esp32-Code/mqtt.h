#ifndef MQTT_H
#define MQTT_H

#include <ArduinoJson.h>
#include <PubSubClient.h>

// Forward declarations - these are defined in the main sketch
extern PubSubClient mqttClient;
extern const int Relay1;
extern const int Relay2;
extern const int Relay3;
extern const int Relay4;

// MQTT topics
const char *TempHumidTopic = "sensor/get/TempHum";
const char *RelayTopic = "home/command/Relay";
const char *relayStatus = "sensor/set/relayState";
const char *rgbTopic = "home/command/rgb";
const char *HeadIndex = "home/sensor/TempHumid";

// Forward declarations
String readTempHumid(); // Function from main sketch
void setRingColor(int r, int g, int b, int a);
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
    Serial.println("Set intital state of relay on startup");

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

  else if (String(topic) == rgbTopic)
  {
    Serial.println("rgb ring state changed");

    // Parse JSON using ArduinoJson
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error)
    {
      Serial.print("rgba deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }

    // Extract relay states from JSON and update pins
    int r = doc["r"].as<int>();
    int g = doc["g"].as<int>();
    int b = doc["b"].as<int>();
    float alpha = doc["a"].as<float>();
      int a = round(alpha * 255);  // Convert from 0-1 scale to 0-255
        staticColorMode = true;
    setRingColor(r, g, b, a);
  }
}

void reconnect()
{
  while (!mqttClient.connected())
  {
    Serial.println("Connecting to MQTT...");
    if (mqttClient.connect("ESP32Client", mqtt_username, mqtt_password))
    {
      mqttClient.publish("Esp32Connected", "your Esp32 is connected");
      Serial.println("Connected to MQTT");
      mqttClient.subscribe(relayStatus);
      mqttClient.subscribe(TempHumidTopic);
      mqttClient.subscribe(RelayTopic);
      mqttClient.subscribe(rgbTopic);
      Serial.println("subscribed ");
    }
    else
    {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

#endif // MQTT_H