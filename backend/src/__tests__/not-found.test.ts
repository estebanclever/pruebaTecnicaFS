import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Not found handler", () => {
  it("GET /ruta-que-no-existe responde 404 con mensaje claro", async () => {
    const res = await request(app).get("/ruta-que-no-existe");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Ruta no encontrada" });
  });
});