import { Router } from "express";
import { getPokemonByName, listPokemon } from "../controllers/pokemon.controller";

const router = Router();

router.get("/pokemon", listPokemon);
router.get("/pokemon/:name", getPokemonByName);

export default router;