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
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_API_ORGANIZATION,
});

async function runAI() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion);
}

app.get("/ai", async (_, res) => {
  await runAI();
  res.send("OK");
});

app.use("/api/user", userRoutes);
app.use("/api/image", imageRoutes);

app.listen(process.env.PORT || 8080, async () => {
  await mongodbConfig();
  console.log("Server on http://localhost:8080/");
});
