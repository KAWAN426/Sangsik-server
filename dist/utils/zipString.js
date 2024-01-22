"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompressString = exports.compressString = void 0;
const tslib_1 = require("tslib");
const zlib_1 = tslib_1.__importDefault(require("zlib"));
function compressString(str) {
    return zlib_1.default.gzipSync(str).toString("base64");
}
exports.compressString = compressString;
function decompressString(compressedStr) {
    return zlib_1.default.gunzipSync(Buffer.from(compressedStr, "base64")).toString();
}
exports.decompressString = decompressString;
//# sourceMappingURL=zipString.js.map