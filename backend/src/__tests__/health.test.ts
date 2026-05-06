import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Health endpoints", () => {
  it("GET /health responde 200 y OK", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });
});