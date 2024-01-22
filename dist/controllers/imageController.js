"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.upload = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const stream_1 = require("stream");
const s3_1 = tslib_1.__importDefault(require("@/lib/s3"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
const resizeAndUploadImage = async (file) => {
    const maxWidth = 1200;
    const maxHeight = 675;
    const resizedImage = await (0, sharp_1.default)(file.buffer)
        .metadata()
        .then((metadata) => {
        const { width, height } = metadata;
        if (width && height && width <= maxWidth && height <= maxHeight)
            return (0, sharp_1.default)(file.buffer)
                .toFormat("jpeg")
                .jpeg({ quality: 80 })
                .toBuffer();
        return (0, sharp_1.default)(file.buffer)
            .resize({
            width: maxWidth,
            height: maxHeight,
            fit: sharp_1.default.fit.inside,
            withoutEnlargement: true,
        })
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toBuffer();
    });
    const params = {
        Bucket: "cnowledge", // 버킷 이름
        Key: `${Date.now()}.jpeg`, // 파일 이름
        Body: new stream_1.Readable({
            read() {
                this.push(resizedImage);
                this.push(null);
            },
        }),
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