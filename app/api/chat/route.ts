import axios from "axios";
import { NextRequest } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client for DashScope (Qwen)
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY!,
  baseURL: process.env.DASHSCOPE_URL,
});

// Optional: Map language codes to readable form
const languageMap: Record<string, string> = {
  en: "English",
  ms: "Bahasa Malaysia",
  zh: "Mandarin Chinese",
  ta: "Tamil",
};

async function getAIResponse(message: string, profile?: any): Promise<string | null> {
  const languageInstruction = profile?.language
    ? `Respond in ${languageMap[profile.language] || "the user's preferred language"}.`
    : "";

  const systemMessage = profile
    ? `You are an assistant helping a user named ${profile.name}, a ${profile.age}-year-old ${profile.occupation} living in ${profile.location}. They earn RM${profile.income} monthly. ${languageInstruction}`
    : `You are a helpful assistant for Malaysian government services.`;

  const url = `https://dashscope-intl.aliyuncs.com/api/v1/apps/${appId}/completion`;

  const inputData = {
    input: {
      prompt: message
    },
    body: JSON.stringify({
      prompt: message,
    }),
    parameters: {},
    debug: {}
  };

  const response = await axios.post(url, inputData, {
    headers: {
      'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.statusText == "OK") {
    return response.data.output.text;
  } else {
    throw new Error("Failed to fetch from PAI");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = await req.json();

    const reply = await getAIResponse(message, profile);

    return Response.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return Response.json({
      reply: "Sorry, I'm having trouble connecting right now. Please try again later.",
    });
  }
}
