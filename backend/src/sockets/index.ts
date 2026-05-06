import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_ORIGINS,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] cliente conectado: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`[socket] cliente desconectado: ${socket.id} (${reason})`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO no está inicializado");
  }
  return io;
};

export const emitFavoriteAdded = (payload: unknown) => {
  const io = getIo();
  io.emit("favorite:added", payload);
  console.log("[socket] evento emitido (broadcast): favorite:added");
};

export const emitFavoriteRemoved = (payload: unknown) => {
  const io = getIo();
  io.emit("favorite:removed", payload);
  console.log("[socket] evento emitido (broadcast): favorite:removed");
};

export const emitFavoriteUpdated = (payload: unknown) => {
  const io = getIo();
  io.emit("favorite:updated", payload);
  console.log("[socket] evento emitido (broadcast): favorite:updated");
};