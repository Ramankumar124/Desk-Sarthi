import { Request, Response, Express, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session"; // Add this import
import logger from "./utils/logger";
import { errorHandler } from "./middleware/ErrorHandler.middleware";
import { WeatherRoutes } from "./routes/climate.route";
import { deviceRoutes } from "./routes/device.route";
import { spotifyRoutes } from "./routes/spotify.route";

const app: Express = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: any) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Configure express-session (add this before your routes)
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false, // Only save sessions when you store data
    cookie: {
      secure: false, // Since you're using HTTP
      httpOnly: true, // Protect cookies from client-side JS
      maxAge: 15 * 60 * 1000, // 15 minutes is enough for auth flow
      sameSite: "lax", // Use 'lax' for HTTP (can't use 'none' without secure:true)
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(urlencoded({ extended: true, limit: "1mb" }));
const ALLOWED_ORIGINS: string[] = [
  process.env.CLIENT_URL as string,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use("/api/v1/weather", WeatherRoutes);
app.use("/api/v1/device", deviceRoutes);
app.use("/api/v1/spotify", spotifyRoutes);
app.use(errorHandler);

export default app;
