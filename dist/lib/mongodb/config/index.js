"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongodbConfig = async () => {
    const ATLAS_URI = process.env.ATLAS_URI;
    if (!ATLAS_URI)
        return;
    await mongoose_1.default
        .connect(ATLAS_URI, {
        dbName: "sangsiksun",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(async (dbo) => {
        console.log("mongoDB connected");
        return true;
    }, (err) => {
        console.log("mongodb connection error", err);
        return;
    });
};
exports.default = mongodbConfig;
//# sourceMappingURL=index.js.map