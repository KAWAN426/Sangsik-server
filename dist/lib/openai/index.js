"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const openai_1 = tslib_1.__importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_API_ORGANIZATION,
});
exports.default = openai;
//# sourceMappingURL=index.js.map