import { Router } from "express";
import migrations from "../controllers/migrationsController.js";

const router = Router();

router.get("/", migrations.getMigrations);
router.post("/", migrations.postMigrations);

export default router;
