import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { getMQTTClient } from "../service/mqtt/mqttClient";
import { db } from "../database";
import { heatIndex } from "../database/schema";
import { sql } from 'drizzle-orm';
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
const getIndoorAnalytics = asyncHandler(async (req, res, next) => {
  const {duration}=req.body;
  console.log("req body",req.body)
  // Examples for duration parameter:
  // '1 hour'    - Data from the last hour
  // '24 hours'  - Data from the last 24 hours
  // '7 days'    - Data from the last week
  // '1 month'   - Data from the last month
  // '1 year'    - Data from the last year
  // '30 minutes' - Data from the last 30 minutes

  const data = await db?.select()
    .from(heatIndex)
    .where(sql`
      timestamp > NOW() - INTERVAL ${sql.raw(`'${duration}'`)}
    `)
    .orderBy(heatIndex.timestamp);

  if (!data?.length) {
    return next(new ApiError(404, "No data found"));
  }
  // Convert timestamps to IST for the response
  const formattedData = data.map(item => ({
    ...item,
    timestamp: new Date(item.timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedData, "Indoor climate data retrieved successfully")
  );
});


export { IndoorClimate ,getIndoorAnalytics};
