import { getMQTTClient } from "../mqtt/mqttClient";
const mqtt = getMQTTClient();

export const handleSocket = (socket: any, io: any) => {
  interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
  }

  socket.on("rgbChange", ({ rgba }: { rgba: RGBA }) => {
    
    console.log(
      `🎨 Real-time RGB: R=${rgba.r}, G=${rgba.g}, B=${rgba.b}, A=${rgba.a}`
    );
    const message = JSON.stringify(rgba);
    mqtt.publish("home/command/rgb", message);
  });
};
