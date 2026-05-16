import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import exercises from "../controllers/exercisesController.js";

const router = Router();

router.post("/", authentication.canRequest, exercises.createExercises);
router.get("/", authentication.canRequest, exercises.findAllExercices);

export default router;
