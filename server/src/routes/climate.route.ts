import { Router } from "express";
import { outdoorWeather } from "../controller/outdoorWeather.controller";
import { IndoorClimate } from "../controller/indoorClimate.controller";

const router = Router();

router.route("/outdoor-climate").get(outdoorWeather);
router.route("/IndoorClimate").get(IndoorClimate);
export { router as WeatherRoutes };
