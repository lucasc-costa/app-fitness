import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import exercises from "../controllers/exercisesController.js";
import errorHandler from "../middlewares/errorHandler.js";
import requireFields from "../middlewares/requireFields.js";
import validateEmptyFields from "../middlewares/validateEmptyFields.js";
import validateAllowedFields from "../middlewares/validateAllowedFields.js";
import validateId from "../middlewares/validateUUID.js";

const router = Router();

router.post(
  "/",
  authentication.canRequest,
  requireFields("body", ["name", "muscle_group"]),
  validateEmptyFields("body", ["name", "muscle_group"]),
  validateAllowedFields("body", ["name", "muscle_group"]),
  errorHandler.asyncHandler(exercises.createExercise)
);
router.get(
  "/",
  authentication.canRequest,
  requireFields("query", ["muscle_group"]),
  validateEmptyFields("query", ["name", "muscle_group"]),
  validateAllowedFields("query", ["name", "muscle_group"]),
  errorHandler.asyncHandler(exercises.findAllExercises)
);
router.get(
  "/:id",
  authentication.canRequest,
  validateId,
  errorHandler.asyncHandler(exercises.findExerciseById)
);
router.patch(
  "/:id",
  authentication.canRequest,
  validateId,
  validateEmptyFields("body", ["name", "muscle_group"]),
  validateAllowedFields("body", ["name", "muscle_group"]),
  errorHandler.asyncHandler(exercises.updateExercise)
);
router.delete(
  "/:id",
  validateId,
  authentication.canRequest,
  errorHandler.asyncHandler(exercises.deleteExercise)
);

export default router;
