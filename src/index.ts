// import "module-alias/register";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
dotenv.config();
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}
// import cors from "@/middleware/cors";
import mongodbConfig from "@/lib/mongodb/config";
import userRoutes from "@/routers/UserRoutes";
import imageRoutes from "@/routers/ImageRoutes";
import postRoutes from "@/routers/PostRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const whitelist = [
//   "http://localhost:3000",
//   ...(process.env.ALLOW_DOMAIN?.split(", ") || []),
// ];
// const corsOptions = {
//   origin: function (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

app.use(cors());
app.use(helmet());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/image", imageRoutes);

let v = "null";

app.get("/", (req, res) => {
  res.send(v);
});

app.listen(process.env.PORT || 8080, async () => {
  const result = await mongodbConfig();
  if (result) v = "connected";
  console.log("Server on http://localhost:8080/");
});
