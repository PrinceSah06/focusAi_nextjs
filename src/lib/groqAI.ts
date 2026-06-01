import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async  function main(text:string) {
  const chatCompletion = await getGroqChatCompletion(text);
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export   async function getGroqChatCompletion(text:string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
