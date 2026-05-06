import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).send("OK");
};

export const getDbHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.status(200).json({
      ok: true,
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    next(error);
  }
};