"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    postId: {
        type: String,
        required: true,
        ref: "Post",
    },
    userId: {
        type: String,
        required: true,
        ref: "User",
    },
    reportType: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true });
const Report = mongoose_1.default.model("Report", reportSchema);
exports.default = Report;
//# sourceMappingURL=Report.js.map