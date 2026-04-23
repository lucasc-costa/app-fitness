import { Router } from "express";
import users from "../controllers/userController.js";

const router = Router();

router.get("/", users.getUser);
router.get("/:id", users.getUserById);
router.post("/", users.createUser);
router.put("/:id", users.updateUser);
router.delete("/:id", users.deleteUser);

export default router;
