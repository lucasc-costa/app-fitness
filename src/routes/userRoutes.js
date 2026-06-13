import { Router } from "express";
import users from "../controllers/userController.js";
import errorHandler from "../middlewares/errorHandler.js";

const router = Router();

router.post("/", errorHandler.asyncHandler(users.createUser));
router.post("/login", errorHandler.asyncHandler(users.loginUser));

export default router;
