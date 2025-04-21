import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { getMQTTClient } from "../service/mqtt/mqttClient";

const IndoorClimate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const mqtt = getMQTTClient();

    const topic = "home/command/Temp";
    const message = "get_TempHumid";
    mqtt.publish(topic, message, { qos: 0 }, (error) => {
      if (error) {
        return next(new ApiError(400, "Unable to get Indor Weather Data"));
      }
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Weather data sended Successfuly"));
  }
);
export { IndoorClimate };
