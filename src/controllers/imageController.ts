import multer from "multer";
import s3 from "@/lib/s3";
import { Request, Response } from "express";
import Jimp from "jimp";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

const resizeAndUploadImage = async (file: Express.Multer.File) => {
  const maxWidth = 1200;
  const maxHeight = 675;
  // const resizedImage = await sharp(file.buffer)
  //   .metadata()
  //   .then((metadata) => {
  //     const { width, height } = metadata;

  //     if (width && height && width <= maxWidth && height <= maxHeight)
  //       return sharp(file.buffer)
  //         .toFormat("jpeg")
  //         .jpeg({ quality: 80 })
  //         .toBuffer();

  //     return sharp(file.buffer)
  //       .resize({
  //         width: maxWidth,
  //         height: maxHeight,
  //         fit: sharp.fit.inside,
  //         withoutEnlargement: true,
  //       })
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 80 })
  //       .toBuffer();
  //   });

  const image = await Jimp.read(file.buffer);
  const { width, height } = image.bitmap;

  if (width > maxWidth || height > maxHeight) {
    if (width > height) {
      image.resize(maxWidth, Jimp.AUTO);
    } else {
      image.resize(Jimp.AUTO, maxHeight);
    }
  }

  const resizedImage = await image.getBufferAsync(Jimp.MIME_JPEG);

  const params = {
    Bucket: "cnowledge", // 버킷 이름
    Key: `${Date.now()}.jpg`, // 파일 이름
    Body: resizedImage,
    ContentType: "image/jpeg",
  };

  return s3.upload(params).promise();
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return;
    const result = await resizeAndUploadImage(req.file);
    res.json({
      message: "Image uploaded successfully",
      url: result.Location,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error });
  }
};
