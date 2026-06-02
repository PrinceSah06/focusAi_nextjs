import Groq from "groq-sdk";
import { buildSchedulePrompt } from "@/src/lib/prompts/schedulePrompt";
import type { Task } from "../types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function main(prompt: Task[]) {
  const text = buildSchedulePrompt(prompt);
  const chatCompletion = await getGroqChatCompletion(text);
  const content = chatCompletion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned an empty response");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}

export async function getGroqChatCompletion(text: string) {
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
