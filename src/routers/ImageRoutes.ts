import { upload, uploadImage } from "@/controllers/imageController";
import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;
