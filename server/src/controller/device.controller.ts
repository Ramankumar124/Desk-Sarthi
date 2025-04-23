import e, { Request, Response } from "express";
import { getMQTTClient } from "../service/mqtt/mqttClient";
import { ApiResponse } from "../utils/ApiResponse";
import { db } from "../database";
import { NewRelayData, relaySwitches } from "../database/schema";
import { eq } from "drizzle-orm";
import { RELAY_STATE_ROW_ID, updateRelayState } from "../utils/diviceRelay";
import { asyncHandler } from "../utils/Asynchandler";

// Get current relay states
export const getRelayStates = asyncHandler(

  async (req: Request, res: Response) => {
    const states = await db
      ?.select()
      .from(relaySwitches)
      .where(eq(relaySwitches.id, RELAY_STATE_ROW_ID));

    if (!states || states.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Relay states not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, states[0], "Relay states retrieved successfully")
      );
  }
);

export const toggleSwitch = asyncHandler(
  async (req: Request, res: Response) => {
    const mqtt = getMQTTClient();

    let { switchId, state } = req.body; // e.g., switch1 / ON
    if (state == true) state = "ON";
    else state = "OFF";

    const topic = `home/command/Relay`;
    const message = `{"id":"Relay${switchId}","state":"${state}"}`; // "ON" or "OFF"
    // {"id":"Relay1","state":"ON"}
    mqtt.publish(topic, message);

    updateRelayState(switchId, state)
      .then(() => {
        console.log(`📤 MQTT Publish: ${topic} → ${message}`);
        res
          .status(200)
          .json(new ApiResponse(200, {}, "Switch Set Successfully"));
      })
      .catch((error) => {
        console.error("Error updating relay state:", error);
        res
          .status(500)
          .json(new ApiResponse(500, {}, "Failed to set switch state"));
      });
  }
);

export const setRGB = (req: Request, res: Response) => {
  const mqtt = getMQTTClient();
  const { r, g, b } = req.body;

  const topic = "home/command/rgb";
  const message = `${r},${g},${b}`;

  mqtt.publish(topic, message);
  console.log(`🎨 RGB set to ${message}`);
  res.status(200).json(new ApiResponse(200, {}, "RGB Set Successfully"));
};
