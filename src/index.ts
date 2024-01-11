import express, { Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "@/middleware/cors";
import multer from "multer";
import AWS from "aws-sdk";
import sharp from "sharp";
import { Readable } from "stream";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 이미지 리사이징 및 S3 업로드 함수
const resizeAndUploadImage = async (
  file: Express.Multer.File,
  width: number,
  height: number
) => {
  const maxWidth = 1200;
  const maxHeight = 675;
  const resizedImage = await sharp(file.buffer)
    .metadata()
    .then((metadata) => {
      const { width, height } = metadata;

      if (width && height && width <= maxWidth && height <= maxHeight)
        return sharp(file.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toBuffer();

      return sharp(file.buffer)
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toBuffer();
    });

  const params = {
    Bucket: "cnowledge", // 버킷 이름
    Key: `resized-${Date.now()}.jpeg`, // 파일 이름
    Body: new Readable({
      read() {
        this.push(resizedImage);
        this.push(null);
      },
    }),
    ContentType: "image/jpeg",
  };

  return s3.upload(params).promise();
};

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) return;
      const result = await resizeAndUploadImage(req.file, 1200, 675);
      res.json({
        message: "Image uploaded successfully",
        url: result.Location,
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading image", error: error });
    }
  }
);

app.get("/", (_, res) => {
  res.send("OK");
});

app.listen(process.env.PORT || 8080, async () => {
  console.log("Server on http://localhost:8080/");
});
