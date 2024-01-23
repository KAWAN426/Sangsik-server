"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const UserController = tslib_1.__importStar(require("../controllers/userController"));
const router = (0, express_1.Router)();
//* desc 특정 id의 사용자 데이터 얻어옴
//* params: { id: string }
router.get("/:id", UserController.getUser);
//* desc 사용자의 token으로 페이로드를 얻어옴
//* body: { token: string }
// router.post("/", UserController.loginUser);
router.post("/create", UserController.createUser);
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map