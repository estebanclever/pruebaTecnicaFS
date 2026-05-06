import { Router } from "express";
import {
  deleteFavorite,
  getFavorites,
  patchFavoriteNote,
  postFavorite,
} from "../controllers/favorites.controller";

const router = Router();

router.get("/favorites", getFavorites);
router.post("/favorites", postFavorite);
router.patch("/favorites/:id/note", patchFavoriteNote);
router.delete("/favorites/:id", deleteFavorite);

export default router;