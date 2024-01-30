import openai from ".";

const verifyContents = async (title: string, detail: string) => {
  const q = `title: ${title}, contents: ${detail}}`;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Review the provided content and if there are any definitive inaccuracies, write a brief explanation about these errors. If the content is reasonably accurate, respond with 'true' only. ${q}`,
      },
    ],
    model: "gpt-4",
  });
  return completion.choices[0].message.content;
};

export default verifyContents