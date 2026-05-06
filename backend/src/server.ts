import http from "http";
import app from "./app";
import { env } from "./config/env";
import { initSocket } from "./sockets";

const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`Backend escuchando en http://localhost:${env.PORT}`);
});