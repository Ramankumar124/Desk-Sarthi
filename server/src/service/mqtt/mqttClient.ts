import mqtt, { MqttClient } from "mqtt";
import { heatIndex, relaySwitches } from "../../database/schema";
import { db } from "../../database";
import { RELAY_STATE_ROW_ID } from "../../utils/diviceRelay";
import { eq } from "drizzle-orm";


const options = {
  host: process.env.HIVEMQ_HOST,
  port: 8883,
  protocol: 'mqtts' as 'mqtts',
  username: process.env.HIVEMQ_USERNAME,
  password: process.env.HIVEMQ_PASSWORD,
};

export let mqttClient: MqttClient = mqtt.connect(options);

mqttClient.on("connect", () => {
  console.log("✅ MQTT connected To Server With Client Id",mqttClient.options.clientId);
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
      io.emit("heatIndex", { topic, data });
      await db?.insert(heatIndex).values({
        temperature: parsedData.temp,
        humidity: parsedData.hum,
      });

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
