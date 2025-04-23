import { Router } from "express";
import { outdoorWeather } from "../controller/outdoorWeather.controller";
import { getIndoorAnalytics, IndoorClimate } from "../controller/indoorClimate.controller";

const router = Router();

router.route("/outdoor-climate").get(outdoorWeather);
router.route("/IndoorClimate").get(IndoorClimate);
router.route("/indoorAnalytics").post(getIndoorAnalytics);
export { router as WeatherRoutes };
