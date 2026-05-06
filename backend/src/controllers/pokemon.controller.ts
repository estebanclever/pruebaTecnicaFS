import { NextFunction, Request, Response } from "express";
import { getPokemonDetail, getPokemonList } from "../services/pokemon.service";

export const listPokemon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitRaw = req.query.limit as string | undefined;
    const offsetRaw = req.query.offset as string | undefined;

    const limit = limitRaw ? Number(limitRaw) : 20;
    const offset = offsetRaw ? Number(offsetRaw) : 0;

    if (
      Number.isNaN(limit) ||
      Number.isNaN(offset) ||
      limit < 1 ||
      limit > 100 ||
      offset < 0
    ) {
      return res.status(400).json({
        message:
          "Parámetros inválidos. Usa limit (1-100) y offset (>=0) numéricos.",
      });
    }

    const data = await getPokemonList(limit, offset);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getPokemonByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = (req.params.name as string | undefined)?.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({ message: "El parámetro name es obligatorio" });
    }

    const data = await getPokemonDetail(name);

    if (!data) {
      return res.status(404).json({ message: "Pokémon no encontrado" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};