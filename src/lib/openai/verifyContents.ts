import openai from ".";

const verifyContents = async (
  title: string,
  detail: string
): Promise<{ status: boolean; message?: string }> => {
  const result = await aiTest(title, detail);
  if (
    result?.toLowerCase() === "true" ||
    result?.toLowerCase() === "참" ||
    result?.toLowerCase() === "정확합니다."
  )
    return {
      status: true,
      message: undefined,
    };
  return {
    status: false,
    message: result,
  };
};

const aiTest = async (title: string, detail: string) => {
  const q = `title: ${title}, contents: ${detail}}`;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Please review the content. If it lacks specific information or knowledge, provide a one-sentence guide in Korean. If there are inaccuracies, write a brief explanation in Korean. Respond with 'true' in English if the content is suitable. ${q}`,
      },
    ],
    model: "gpt-4",
  });
  let result = completion.choices[0].message.content;
  if (!result) return;
  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.substring(1, result.length - 1);
  }
  if (result.startsWith(`'`) && result.endsWith(`'`)) {
    result = result.substring(1, result.length - 1);
  }
  return result;
};

export default verifyContents;
