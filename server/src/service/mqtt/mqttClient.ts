import mqtt, { MqttClient } from "mqtt";
import { heatIndex, relaySwitches } from "../../database/schema";
import { db } from "../../database";
import { RELAY_STATE_ROW_ID } from "../../utils/diviceRelay";
import { eq } from "drizzle-orm";

let mqttClient: MqttClient = mqtt.connect("mqtt://192.168.31.94");

mqttClient.on("connect", () => {
  console.log("✅ MQTT connected (default)");
  mqttClient.subscribe("home/sensors/TempHumid");
  mqttClient.subscribe("device/status/relay");
  mqttClient.subscribe("device/status/rgb");
  mqttClient.subscribe("Esp32Connected");
});

mqttClient.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

export const initMQTT = (io: any) => {
  mqttClient.on("message", async (topic, message) => {
    const data = message.toString();
    console.log(`📥 MQTT: ${topic} - ${data}`);

    if (topic == "Esp32Connected") {
      console.log("ESp32 Connected TO server");

      const states = await db
        ?.select()
        .from(relaySwitches)
        .where(eq(relaySwitches.id, RELAY_STATE_ROW_ID));
      const state = states?.[0];

      if (state) {
        const { id, ...relayOnly } = state;
        mqttClient.publish(
          "home/sensors/relayState",
          JSON.stringify(relayOnly)
        );
      }
      mqttClient.publish("home/sensors/relayState", JSON.stringify(state));
    } else if (topic === "home/sensors/TempHumid") {
      const parsedData = JSON.parse(data);
      console.log(parsedData, typeof parsedData);
      await db?.insert(heatIndex).values({
        temperature: parsedData.temp,
        humidity: parsedData.hum,
      });

      io.emit("heatIndex", { topic, data });
    } else if (topic === "device/status/relay") {
      io.emit("relayStatus", { topic, data });
    } else if (topic === "device/status/rgb") {
      io.emit("rgbStatus", { topic, data });
    }
  });
};

export const getMQTTClient = () => {
  return mqttClient;
};
