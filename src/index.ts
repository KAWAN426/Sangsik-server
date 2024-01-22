// import "module-alias/register";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}
import cors from "@/middleware/cors";
import mongodbConfig from "@/lib/mongodb/config";
import userRoutes from "@/routers/UserRoutes";
import imageRoutes from "@/routers/ImageRoutes";
import postRoutes from "@/routers/PostRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/image", imageRoutes);

app.get("/", (req, res) => {
  res.send("Ok");
});

app.listen(process.env.PORT || 8080, async () => {
  await mongodbConfig();
  console.log("Server on http://localhost:8080/");
});
