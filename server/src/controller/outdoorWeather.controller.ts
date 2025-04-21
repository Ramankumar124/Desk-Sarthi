import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const outdoorWeather = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const city = "kharar";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_OPEN_WEATHER}&units=metric`
    );

    if (!response.ok)
      return next(new ApiError(400, "failded to fetch Weather data"));
    const data = await response.json();
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Weather data sended Successfuly"));
  }
);
export { outdoorWeather };
