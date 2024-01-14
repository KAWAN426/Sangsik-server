import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "@/middleware/cors";
import mongodbConfig from "./mongodb/config";
import userRoutes from "@/routers/UserRoutes";
import imageRoutes from "@/routers/ImageRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

app.get("/", (_, res) => {
  res.send("OK");
});

app.use("/api/user", userRoutes);
app.use("/api/image", imageRoutes);

app.listen(process.env.PORT || 8080, async () => {
  await mongodbConfig();
  console.log("Server on http://localhost:8080/");
});
