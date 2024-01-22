"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cors_1 = tslib_1.__importDefault(require("cors"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const whitelist = [
    "http://localhost:3000",
    ...(((_a = process.env.ALLOW_DOMAIN) === null || _a === void 0 ? void 0 : _a.split(", ")) || []),
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
exports.default = (0, cors_1.default)(corsOptions);
//# sourceMappingURL=index.js.map