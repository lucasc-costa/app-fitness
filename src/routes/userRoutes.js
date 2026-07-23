import { Router } from "express";
import users from "../controllers/userController.js";
import errorHandler from "../middlewares/errorHandler.js";
import requireFields from "../middlewares/requireFields.js";
import validateEmptyFields from "../middlewares/validateEmptyFields.js";
import validateAllowedFields from "../middlewares/validateAllowedFields.js";

const router = Router();

router.post(
  "/",
  requireFields("body", ["username", "email", "password"]),
  validateEmptyFields("body", ["username", "email", "password"]),
  validateAllowedFields("body", ["username", "email", "password"]),
  errorHandler.asyncHandler(users.createUser)
);
router.post(
  "/login",
  requireFields("body", ["username", "password"]),
  validateEmptyFields("body", ["username", "password"]),
  validateAllowedFields("body", ["username", "password"]),
  errorHandler.asyncHandler(users.loginUser)
);

export default router;
