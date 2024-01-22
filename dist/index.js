"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import "module-alias/register";
const express_1 = tslib_1.__importDefault(require("express"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const cors_1 = tslib_1.__importDefault(require("cors"));
dotenv_1.default.config();
if (process.env.NODE_ENV === "production") {
    require("module-alias/register");
}
// import cors from "@/middleware/cors";
const config_1 = tslib_1.__importDefault(require("@/lib/mongodb/config"));
const UserRoutes_1 = tslib_1.__importDefault(require("@/routers/UserRoutes"));
const ImageRoutes_1 = tslib_1.__importDefault(require("@/routers/ImageRoutes"));
const PostRoutes_1 = tslib_1.__importDefault(require("@/routers/PostRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
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
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use("/api/user", UserRoutes_1.default);
app.use("/api/post", PostRoutes_1.default);
app.use("/api/image", ImageRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Ok");
});
app.listen(process.env.PORT || 8080, async () => {
    await (0, config_1.default)();
    console.log("Server on http://localhost:8080/");
});
//# sourceMappingURL=index.js.map