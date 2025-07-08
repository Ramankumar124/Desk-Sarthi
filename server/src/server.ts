import http from "http";
import app from "./app";
import { DBConnection } from "./database/index";
import { Server } from "socket.io";
import { initMQTT } from "./service/mqtt/mqttClient";
import { handleSocket } from "./service/socket/socketHandler";

DBConnection();
  const server = http.createServer(app);
  const ALLOWED_ORIGINS:any = [process.env.CLIENT_URL,"http://localhost:5173"];

  const io = new Server(server, {
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ["GET", "POST"],
    },
  });


  
  try {
    io.on("connection", (socket) => {
      handleSocket(socket, io);
    });
    
    initMQTT(io);
    console.log("socket working perfectly");
  } catch (error) {
    console.log("socket error", error);
  }
  
server.listen(process.env.PORT, () => {
  console.info(`your server is running on Port no ${process.env.PORT}`);
});
