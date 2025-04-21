import mqtt, { MqttClient } from "mqtt";

let mqttClient: MqttClient = mqtt.connect("mqtt://192.168.31.94");

mqttClient.on("connect", () => {
  console.log("✅ MQTT connected (default)");
  mqttClient.subscribe("home/sensors/TempHumid");
  mqttClient.subscribe("device/status/relay");
  mqttClient.subscribe("device/status/rgb");
});

mqttClient.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

export const initMQTT = (io: any) => {
 
  mqttClient.on("message", (topic, message) => {
    const data = message.toString();
    console.log(`📥 MQTT: ${topic} - ${data}`);

    if(topic === "home/sensors/TempHumid") {
      
      io.emit("heatIndex", { topic, data }); 
    }
    else if (topic === "device/status/relay") {      
      io.emit("relayStatus", { topic, data }); 
    }
    else if (topic === "device/status/rgb") {      
      io.emit("rgbStatus", { topic, data }); 
    }
  });
};

export const getMQTTClient = () => {
  return mqttClient;
};
