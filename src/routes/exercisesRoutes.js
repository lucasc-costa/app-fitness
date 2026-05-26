import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import exercises from "../controllers/exercisesController.js";

const router = Router();

router.post("/", authentication.canRequest, exercises.createExercise);
router.get("/", authentication.canRequest, exercises.findAllExercises);
router.patch("/", authentication.canRequest, exercises.updateExercise);
router.delete("/", authentication.canRequest, exercises.deleteExercise);

export default router;
