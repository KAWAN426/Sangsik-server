"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const ATLAS_URI = process.env.ATLAS_URI;
        if (!ATLAS_URI)
            return console.log("Cannot found ATLAS_URI");
        const conn = await mongoose_1.default.connect(ATLAS_URI, {
            dbName: "sangsiksun",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error(err);
    }
};
exports.default = connectDB;
//# sourceMappingURL=index.js.map