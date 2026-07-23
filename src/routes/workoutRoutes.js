import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import workouts from "../controllers/workoutController.js";
import errorHandler from "../middlewares/errorHandler.js";
import requireFields from "../middlewares/requireFields.js";
import validateEmptyFields from "../middlewares/validateEmptyFields.js";
import validateAllowedFields from "../middlewares/validateAllowedFields.js";
import validateId from "../middlewares/validateUUID.js";

const router = Router();

router.post(
  "/",
  authentication.canRequest,
  requireFields("body", ["name", "expires_at"]),
  validateEmptyFields("body", ["name", "expires_at"]),
  validateAllowedFields("body", ["name", "expires_at"]),
  errorHandler.asyncHandler(workouts.createWorkout)
);
router.get(
  "/",
  authentication.canRequest,
  errorHandler.asyncHandler(workouts.findAllWorkouts)
);
router.get(
  "/:id",
  authentication.canRequest,
  validateId,
  errorHandler.asyncHandler(workouts.findWorkoutById)
);
router.patch(
  "/:id",
  authentication.canRequest,
  validateId,
  validateEmptyFields("body", ["name", "expires_at"]),
  validateAllowedFields("body", ["name", "expires_at"]),
  errorHandler.asyncHandler(workouts.updateWorkout)
);
router.delete(
  "/:id",
  authentication.canRequest,
  validateId,
  errorHandler.asyncHandler(workouts.deleteWorkout)
);

export default router;
