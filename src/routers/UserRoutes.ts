import { Router } from "express";
import * as UserController from "@/controllers/userController";

const router = Router();

//* desc 특정 id의 사용자 데이터 얻어옴
//* params: { id: string }
router.get("/:id", UserController.getUser);

//* desc 사용자의 token으로 페이로드를 얻어옴
//* body: { token: string }
router.post("/", UserController.loginUser);

export default router;
