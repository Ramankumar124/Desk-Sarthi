import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { getMQTTClient, mqttClient } from "../service/mqtt/mqttClient";
import { db } from "../database";
import { heatIndex } from "../database/schema";
import { sql } from "drizzle-orm";

const IndoorClimate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const mqtt = getMQTTClient();
    const topic = "sensor/get/TempHum";
    const message = "get_TempHumid";
    // send get temphum command to device
    mqtt.publish(topic, message, { qos: 0 }, (error) => {
      if (error) {
        return next(new ApiError(400, "Unable to get Indor Weather Data"));
      }
    });

    return new Promise<void>((resolve, reject) => {
      let TempIndex: any;

      const messageHandler = async (topic: string, message: Buffer) => {
        const data = message.toString();
        console.log(`📥 MQTT: ${topic} - ${data}`);
        // reciver tempHum data from device
        if (topic === "home/sensor/TempHumid") {
          TempIndex = JSON.parse(data);
          mqttClient.removeListener("message", messageHandler);

          res
            .status(200)
            .json(
              new ApiResponse(200, TempIndex, "Weather data sent Successfully")
            );

          resolve();
        }
      };

      mqttClient.on("message", messageHandler);

      // Set a timeout in case no message arrives
      setTimeout(() => {
        mqttClient.removeListener("message", messageHandler);
        reject(new ApiError(408, "Timeout waiting for indoor climate data"));
      }, 10000); // 10 seconds timeout
    });
  }
);
const getIndoorAnalytics = asyncHandler(async (req, res, next) => {
  const { duration } = req.body;
  const data = await db
    ?.select()
    .from(heatIndex)
    .where(
      sql`
      timestamp > NOW() - INTERVAL ${sql.raw(`'${duration}'`)}
    `
    )
    .orderBy(heatIndex.timestamp);

  if (!data?.length) {
    return next(new ApiError(404, "No data found"));
  }
  // Convert timestamps to IST for the response
  const formattedData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formattedData,
        "Indoor climate data retrieved successfully"
      )
    );
});

export { IndoorClimate, getIndoorAnalytics };
