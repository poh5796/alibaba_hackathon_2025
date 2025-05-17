// app/api/chat/route.ts
import { NextRequest } from "next/server";

const PAI_ENDPOINT = process.env.PAI_ENDPOINT!;
const PAI_TOKEN = process.env.PAI_TOKEN!;

async function getAIResponse(message: string): Promise<string> {
  const response = await fetch(PAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PAI_TOKEN}`,
    },
    body: JSON.stringify({
      prompt: message,
      // Add other parameters based on PAI model input format
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch from PAI");
  }

  const data = await response.json();
  return data.output.text || "No response from AI.";
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