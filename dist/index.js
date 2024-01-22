"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const cors_1 = tslib_1.__importDefault(require("@/middleware/cors"));
const config_1 = tslib_1.__importDefault(require("@/lib/mongodb/config"));
const UserRoutes_1 = tslib_1.__importDefault(require("@/routers/UserRoutes"));
const ImageRoutes_1 = tslib_1.__importDefault(require("@/routers/ImageRoutes"));
const PostRoutes_1 = tslib_1.__importDefault(require("@/routers/PostRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default);
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