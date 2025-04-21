import { Router } from "express";
import { setRGB, toggleSwitch } from "../controller/device.controller";

const router = Router();
router.route("/relayToggle").post(toggleSwitch);
router.route("/setRgb").post(setRGB);

export {router as deviceRoutes}