import { getMQTTClient } from "../mqtt/mqttClient";
const mqtt = getMQTTClient();

export const handleSocket = (socket: any, io: any) => {
    socket.on("rgbChange", ({ r, g, b }:any) => {
      const message = `${r},${g},${b}`;
      mqtt.publish("device/rgb", message);
      console.log(`🎨 Real-time RGB: ${message}`);
    });

    socket.on("getTempIndex", () => {
      const topic = "home/command/Temp";
      const message = "get_TempHumid";
      mqtt.publish(topic, message, { qos: 0 }, (error) => {
        if (error) {
         console.log("error while getting data",error);
         
        }
      });
    });
  };
  