"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.upload = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
const s3_1 = tslib_1.__importDefault(require("@/lib/s3"));
const jimp_1 = tslib_1.__importDefault(require("jimp"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
const resizeAndUploadImage = async (file) => {
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
    const image = await jimp_1.default.read(file.buffer);
    const { width, height } = image.bitmap;
    if (width > maxWidth || height > maxHeight) {
        if (width > height) {
            image.resize(maxWidth, jimp_1.default.AUTO);
        }
        else {
            image.resize(jimp_1.default.AUTO, maxHeight);
        }
    }
    const resizedImage = await image.getBufferAsync(jimp_1.default.MIME_JPEG);
    const params = {
        Bucket: "cnowledge", // 버킷 이름
        Key: `${Date.now()}.jpg`, // 파일 이름
        Body: resizedImage,
        ContentType: "image/jpeg",
    };
    return s3_1.default.upload(params).promise();
};
const uploadImage = async (req, res) => {
    try {
        if (!req.file)
            return;
        const result = await resizeAndUploadImage(req.file);
        res.json({
            message: "Image uploaded successfully",
            url: result.Location,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error uploading image", error: error });
    }
};
exports.uploadImage = uploadImage;
//# sourceMappingURL=imageController.js.map