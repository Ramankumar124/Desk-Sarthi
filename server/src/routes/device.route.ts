import { Router } from "express";
import { getRelayStates, setRGB, toggleSwitch } from "../controller/device.controller";

const router = Router();
router.route("/relayToggle").post(toggleSwitch);
router.route("/getRelayState").get(getRelayStates);
router.route("/setRgb").post(setRGB);

export {router as deviceRoutes}