import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY!,
  baseURL: process.env.DASHSCOPE_URL,
});

const languageMap: Record<string, string> = {
  en: "English",
  ms: "Bahasa Malaysia",
  zh: "Mandarin Chinese",
  ta: "Tamil",
};

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = await req.json();

    const languageInstruction = profile?.language
      ? `Respond in ${languageMap[profile.language] || "the user's preferred language"}.`
      : "";

    const systemMessage = profile
      ? `You are assisting ${profile.name}, a ${profile.age}-year-old ${profile.occupation} in ${profile.location}. ${languageInstruction}`
      : "You are a helpful assistant for Malaysian government services.";

    // Prepend system message to the conversation history
    const fullMessages = [{ role: "system", content: systemMessage }, ...messages];

    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      temperature: 0.7,
      messages: fullMessages,
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return Response.json({
      reply: "Sorry, I'm having trouble connecting right now. Please try again later.",
    });
  }
}
