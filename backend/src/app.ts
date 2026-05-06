import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import favoritesRoutes from "./routes/favorites.routes";
import healthRoutes from "./routes/health.routes";
import pokemonRoutes from "./routes/pokemon.routes";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGINS,
    methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json());

// Rutas del sistema
app.use("/", healthRoutes);

// Rutas de dominio
app.use("/", pokemonRoutes);
app.use("/", favoritesRoutes);

// 404 para rutas no definidas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejador global de errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no controlado:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

export default app;