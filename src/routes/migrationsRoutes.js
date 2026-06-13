import { Router } from "express";
import migrations from "../controllers/migrationsController.js";
import errorHandler from "../middlewares/errorHandler.js";

const router = Router();

router.get("/", errorHandler.asyncHandler(migrations.getMigrations));
router.post("/", errorHandler.asyncHandler(migrations.postMigrations));

export default router;
