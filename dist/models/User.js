"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: false,
    },
    loginMethod: {
        type: String,
        required: true,
    },
    externalId: {
        type: String,
        required: false,
    },
}, { timestamps: true });
userSchema.index({ _id: "text" });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map