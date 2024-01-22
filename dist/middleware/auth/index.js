"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || "secret";
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).send("Access Denied");
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decodedPayload) => {
        if (err)
            return res.status(403).send("Invalid Token");
        req.body.user = decodedPayload;
        req.body.token = token;
        next();
    });
}
exports.default = verifyToken;
//# sourceMappingURL=index.js.map