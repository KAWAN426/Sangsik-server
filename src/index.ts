import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "@/middleware/cors";
import mongodbConfig from "./mongodb/config";
import userRoutes from "@/routers/UserRoutes";
import imageRoutes from "@/routers/ImageRoutes";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const callGpt35 = async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });
  console.log(chatCompletion);
};

app.get("/ai", async (_, res) => {
  await callGpt35();
  res.send("OK");
});

app.use("/api/user", userRoutes);
app.use("/api/image", imageRoutes);

app.listen(process.env.PORT || 8080, async () => {
  await mongodbConfig();
  console.log("Server on http://localhost:8080/");
});
