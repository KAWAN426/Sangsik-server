import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, SECRET_KEY, (err, decodedPayload) => {
    if (err) return res.status(403).send("Invalid Token");
    req.body.user = decodedPayload;
    req.body.token = token;
    next();
  });
}
