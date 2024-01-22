"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageController_1 = require("@/controllers/imageController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/upload", imageController_1.upload.single("image"), imageController_1.uploadImage);
exports.default = router;
//# sourceMappingURL=ImageRoutes.js.map