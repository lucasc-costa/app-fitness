import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import exercises from "../controllers/exercisesController.js";
import errorHandler from "../middlewares/errorHandler.js";

const router = Router();

router.post(
  "/",
  authentication.canRequest,
  errorHandler.asyncHandler(exercises.createExercise)
);
router.get(
  "/",
  authentication.canRequest,
  errorHandler.asyncHandler(exercises.findAllExercises)
);
router.get(
  "/:id",
  authentication.canRequest,
  errorHandler.asyncHandler(exercises.findExerciseById)
);
router.patch(
  "/:id",
  authentication.canRequest,
  errorHandler.asyncHandler(exercises.updateExercise)
);
router.delete(
  "/:id",
  authentication.canRequest,
  errorHandler.asyncHandler(exercises.deleteExercise)
);

export default router;
