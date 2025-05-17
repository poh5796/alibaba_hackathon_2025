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

    const incomeStatement = profile?.income
      ? `The user has an income of RM${profile.income}.`
      : "";

    const systemMessage = profile
      ? `You are assisting ${profile.name}, a ${profile.age}-year-old ${profile.occupation} in ${profile.location}. ${incomeStatement} ${languageInstruction} Based on the user's profile, provide relevant information and assistance.`
      : "You are a helpful assistant for Malaysian government services.";

    const extendedsystemMessage = `When the users ask question, try to always provide direct links to the relevant government services. If the user asks about a specific service, provide a brief overview and direct them to the official website for more information. Always be polite and professional in your responses. ${systemMessage}`;

    // Prepend system message to the conversation history
    const fullMessages = [{ role: "system", content: systemMessage + extendedsystemMessage }, ...messages];

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
