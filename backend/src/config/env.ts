import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "POKEAPI_BASE_URL",
  "FRONTEND_ORIGIN",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Falta variable de entorno requerida: ${key}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT),
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  POKEAPI_BASE_URL: process.env.POKEAPI_BASE_URL!,
  FRONTEND_ORIGINS: process.env.FRONTEND_ORIGIN!.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

if (Number.isNaN(env.PORT)) {
  throw new Error("PORT debe ser numérico");
}

if (Number.isNaN(env.DB_PORT)) {
  throw new Error("DB_PORT debe ser numérico");
}

if (env.FRONTEND_ORIGINS.length === 0) {
  throw new Error("FRONTEND_ORIGIN debe incluir al menos un origen válido");
}