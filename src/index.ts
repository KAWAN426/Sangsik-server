import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "@/middleware/cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

app.get("/", (_, res) => {
  res.send("OK");
});

app.listen(process.env.PORT || 8080, async () => {
  console.log("Server on http://localhost:8080/");
});
