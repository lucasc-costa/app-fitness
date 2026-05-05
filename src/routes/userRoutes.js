import { Router } from "express";
import users from "../controllers/userController.js";

const router = Router();

router.post("/", users.createUser);
router.post("/login", users.loginUser);

export default router;
