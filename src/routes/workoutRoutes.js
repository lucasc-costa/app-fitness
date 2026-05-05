import { Router } from "express";
import authentication from "../middlewares/authentication.js";

const router = Router();

router.get("/", authentication.canRequest, () => {
  console.log("foi");
});

export default router;
