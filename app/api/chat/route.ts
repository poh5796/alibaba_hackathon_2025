import { NextRequest } from "next/server";
import OpenAI from "openai";

async function getAIResponse(message: string): Promise<any> {
    const openai = new OpenAI(
        {
            apiKey: process.env.DASHSCOPE_API_KEY,
            baseURL: process.env.DASHSCOPE_URL
        }
    );
    const completion = await openai.chat.completions.create({
        model: "qwen-plus",  
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message}
        ],
    });
    return completion
}

export async function POST(req: NextRequest) {
    const { message } = await req.json();
    try {
        const reply = await getAIResponse(message);
        return Response.json({ reply });
    } catch (error) {
        console.error(error);
        return Response.json({ reply: "Sorry, I'm having trouble connecting right now." });
    }
}