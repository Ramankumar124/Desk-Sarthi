import { Request, Response } from "express";
import { getMQTTClient } from "../service/mqtt/mqttClient";
import { ApiResponse } from "../utils/ApiResponse";

export const toggleSwitch = (req: Request, res: Response) => {
  const mqtt = getMQTTClient();
  let { switchId, state } = req.body; // e.g., switch1 / ON
console.log("body",req.body);
if(state==true) state="ON";
else state="OFF"
  const topic = `home/command/Relay`;
  const message = `{"id":"Relay${switchId}","state":"${state}"}`; // "ON" or "OFF"
// {"id":"Relay1","state":"ON"}
  mqtt.publish(topic, message);
  console.log(`📤 MQTT Publish: ${topic} → ${message}`);
  res.status(200).json(new ApiResponse(200,{},"Switch Set Successfully"));
};

export const setRGB = (req: Request, res: Response) => {
  const mqtt = getMQTTClient();
  const { r, g, b } = req.body;

  const topic = "home/command/rgb";
  const message = `${r},${g},${b}`;

  mqtt.publish(topic, message);
  console.log(`🎨 RGB set to ${message}`);
  res.status(200).json(new ApiResponse(200,{},"RGB Set Successfully"));
};
