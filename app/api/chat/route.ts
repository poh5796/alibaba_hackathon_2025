import axios from "axios";
import { NextRequest } from "next/server";

type ChatResponse = {
  data: {
    output: {
      finish_reason: 'stop' | string;
      reject_status: boolean;
      session_id: string;
      text: string;
      doc_references: {
        source: string;
        link?: string;
        ref_id?: string;
      }[];
    };
    usage: {
      models: {
        model_name: string;
        tokens_used: number;
      }[];
    };
    request_id: string;
  };
};

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

    const fullMessages = [{ role: "system", content: systemMessage + extendedsystemMessage }, ...messages];
    const url = `https://dashscope-intl.aliyuncs.com/api/v1/apps/${process.env.APP_ID}/completion`;

    const inputData = {
      input: {
        prompt: fullMessages
      },
      body: JSON.stringify({
        prompt: fullMessages,
      }),
      parameters: {},
      debug: {}
    };
  
    const response: ChatResponse = await axios.post(url, inputData, {
      headers: {
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  
    return Response.json({content: response.data.output.text, references: response.data.output.doc_references});
  } catch (error) {
    console.error("AI Chat Error:", error);
    return Response.json({
      reply: "Sorry, I'm having trouble connecting right now. Please try again later.",
    });
  }
}
