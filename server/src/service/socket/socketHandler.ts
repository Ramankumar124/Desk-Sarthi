import { getMQTTClient } from "../mqtt/mqttClient";
const mqtt = getMQTTClient();

export const handleSocket = (socket: any, io: any) => {
    socket.on("rgbChange", ({ r, g, b }:any) => {
      const message = `${r},${g},${b}`;
      mqtt.publish("device/rgb", message);
      console.log(`🎨 Real-time RGB: ${message}`);
    });
  };
  