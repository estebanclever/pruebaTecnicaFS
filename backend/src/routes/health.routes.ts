import { Router } from "express";
import { getDbHealth, getHealth } from "../controllers/health.controller";

const router = Router();

router.get("/health", getHealth);
router.get("/db-health", getDbHealth);

export default router;