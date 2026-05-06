import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Favorites validations", () => {
  it("POST /favorites sin pokemon_name responde 400", async () => {
    const res = await request(app).post("/favorites").send({
      pokemon_id: 25,
      image_url: "https://example.com/pikachu.png",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "pokemon_name es obligatorio" });
  });

  it("PATCH /favorites/:id/note con note > 280 responde 400", async () => {
    const longNote = "a".repeat(281);

    const res = await request(app).patch("/favorites/1/note").send({
      note: longNote,
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "note no puede superar 280 caracteres",
    });
  });
});