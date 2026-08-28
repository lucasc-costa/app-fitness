import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import errorHandler from "../middlewares/errorHandler.js";
import requireFields from "../middlewares/requireFields.js";
import validateEmptyFields from "../middlewares/validateEmptyFields.js";
import validateAllowedFields from "../middlewares/validateAllowedFields.js";
import validateId from "../middlewares/validateUUID.js";
import workoutExercises from "../controllers/workoutExercisesController.js";
import validateReorderWorkoutExercises from "../middlewares/validateReorderWorkoutExercises.js";

const router = Router();

router.post(
  "/:workoutId/exercises",
  authentication.canRequest,
  validateId,
  requireFields("body", ["exercise_id", "sets", "reps"]),
  validateEmptyFields("body", [
    "exercise_id",
    "sets",
    "reps",
    "weight",
    "observations",
    "video_url",
  ]),
  validateAllowedFields("body", [
    "exercise_id",
    "sets",
    "reps",
    "weight",
    "observations",
    "video_url",
  ]),
  errorHandler.asyncHandler(workoutExercises.createExercisesController)
);
router.get(
  "/:workoutId/exercises",
  authentication.canRequest,
  validateId,
  errorHandler.asyncHandler(workoutExercises.findAllWorkoutExercises)
);

router.patch(
  "/:workoutId/exercises/reorder",
  authentication.canRequest,
  validateId,
  validateReorderWorkoutExercises(["workout_exercise_id", "sequence"]),
  errorHandler.asyncHandler(workoutExercises.reorderExercises)
);

router.patch(
  "/:workoutId/exercises/:workoutExerciseId",
  authentication.canRequest,
  validateId,
  validateEmptyFields("body", [
    "sets",
    "reps",
    "weight",
    "observations",
    "video_url",
  ]),
  validateAllowedFields("body", [
    "sets",
    "reps",
    "weight",
    "observations",
    "video_url",
  ]),
  errorHandler.asyncHandler(workoutExercises.updateWorkoutExercises)
);

router.delete(
  "/:workoutId/exercises/:workoutExerciseId",
  authentication.canRequest,
  validateId,
  errorHandler.asyncHandler(workoutExercises.deleteWorkoutExercises)
);

export default router;
