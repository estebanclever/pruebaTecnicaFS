import { NextFunction, Request, Response } from "express";
import {
  createFavorite,
  deleteFavoriteById,
  listFavorites,
  updateFavoriteNoteById,
} from "../services/favorites.service";
import {
  emitFavoriteAdded,
  emitFavoriteRemoved,
  emitFavoriteUpdated,
} from "../sockets";

export const getFavorites = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const favorites = await listFavorites();
    return res.status(200).json(favorites);
  } catch (error) {
    return next(error);
  }
};

export const postFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pokemon_name, pokemon_id, image_url, note } = req.body as {
      pokemon_name?: string;
      pokemon_id?: number;
      image_url?: string;
      note?: string;
    };

    if (!pokemon_name || !pokemon_name.trim()) {
      return res.status(400).json({ message: "pokemon_name es obligatorio" });
    }

    if (typeof pokemon_id !== "number" || Number.isNaN(pokemon_id)) {
      return res.status(400).json({ message: "pokemon_id debe ser numérico" });
    }

    const favorite = await createFavorite({
      pokemon_name: pokemon_name.trim(),
      pokemon_id,
      image_url: image_url?.trim(),
      note: note?.trim(),
    });

    emitFavoriteAdded(favorite);

    return res.status(201).json(favorite);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return res.status(409).json({ message: "Ese pokémon ya está en favoritos" });
    }

    return next(error);
  }
};

export const deleteFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "id inválido" });
    }

    const deleted = await deleteFavoriteById(id);

    if (!deleted) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    emitFavoriteRemoved({ id: deleted.id, pokemon_name: deleted.pokemon_name });

    return res.status(200).json(deleted);
  } catch (error) {
    return next(error);
  }
};

export const patchFavoriteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "id inválido" });
    }

    const { note } = req.body as { note?: unknown };

    if (note === undefined) {
      return res.status(400).json({ message: "note es obligatorio (string o null)" });
    }

    if (note !== null && typeof note !== "string") {
      return res.status(400).json({ message: "note debe ser string o null" });
    }

    const normalizedNote = note === null ? null : note.trim();

    if (normalizedNote !== null && normalizedNote.length > 280) {
      return res.status(400).json({ message: "note no puede superar 280 caracteres" });
    }

    const updated = await updateFavoriteNoteById(id, normalizedNote);

    if (!updated) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    emitFavoriteUpdated(updated);

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};