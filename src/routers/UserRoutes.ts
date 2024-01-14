import { Router } from "express";
import * as UserController from "@/controllers/userController";

const router = Router();

router.get("/:id", UserController.getUser);

export default router;
