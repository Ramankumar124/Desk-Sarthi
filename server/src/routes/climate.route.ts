import { Router } from "express";
import { outdoorWeather } from "../controller/outdoorWeather.controller";

const router = Router();

router.route("/outdoor-climate").get(outdoorWeather);
export {router as outdoorClimate}