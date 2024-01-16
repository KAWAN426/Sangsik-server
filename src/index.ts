import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "@/middleware/cors";
import mongodbConfig from "@/lib/mongodb/config";
import userRoutes from "@/routers/UserRoutes";
import imageRoutes from "@/routers/ImageRoutes";
import postRoutes from "@/routers/PostRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors);
app.use(helmet());

// async function runAI() {
//   const q = `제목: 심심한 사과란, 내용: 한 기업이 사회관계망서비스(SNS)에 올린 사과문으로 인해 온라인상에서 문해력 저하 논란이 인 적이 있다. “심심한 사과의 말씀을 드린다”는 글에 “하나도 안 심심하고 재미있다” “심심하다고 해서 더 기분이 나쁘다”는 등의 댓글이 달린 것이다.

// 일부 네티즌이 ‘심심하다’를 ‘지루하고 재미가 없다’는 뜻으로 이해해 벌어진 일이었다. 그러나 사과문에서의 ‘심심(甚深)하다’는 지루하다는 의미의 ‘심심하다’와 소리만 같을 뿐 의미가 다른 동음이의어다. ‘심할 심(甚)’ 자와 ‘깊을 심(深)’ 자가 사용돼 마음의 표현 정도가 매우 깊고 간절하다는 의미를 나타낸다. 따라서 ‘심심한 사과’는 깊고 간절한 사과를 뜻하는 표현이다.`;
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: `다음 대괄호 안의 내용의 제목과 내용은 정보를 알려주는 내용입니다.
//           내용을 판단해서 틀린 정보가 있다면 false와 어디서부터 어디까지가 틀렸는지를 알려주고 부가적인 설명은 붙이지 말아주세요.
//           만약 내용이 적당히 옳바른 내용이라면 오직 true만을 보내주고 부가적인 설명을 붙이지 말아주세요.
//           [ ${q} ]`,
//       },
//     ],
//     model: "gpt-3.5-turbo",
//   });
//   console.log(completion.choices[0].message);
// }

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/image", imageRoutes);

app.listen(process.env.PORT || 8080, async () => {
  await mongodbConfig();
  console.log("Server on http://localhost:8080/");
});
