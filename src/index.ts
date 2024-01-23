import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}
import cors from "@/middleware/cors";
import userRoutes from "@/routers/UserRoutes";
import imageRoutes from "@/routers/ImageRoutes";
import postRoutes from "@/routers/PostRoutes";
import connectDB from "./lib/mongodb/connect";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/image", imageRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(process.env.PORT || 8080, async () => {
  console.log("Server on http://localhost:8080/");
});
