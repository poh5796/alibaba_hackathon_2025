// app/api/chat/route.ts
import axios from "axios";
import { NextRequest } from "next/server";

async function getAIResponse(message: string): Promise<string> {
  const apiKey = 'sk-55b97806532b4dfeb709ac62b477f881';
  const appId = '5b1d9b03606a4f568ed6f98f95fb85bc';

  const url = `https://dashscope-intl.aliyuncs.com/api/v1/apps/${appId}/completion`;

  const inputData = {
    input: {
      prompt: message
    },
    parameters: {},
    debug: {}
  };


  const response = await axios.post(url, inputData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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
  const { message } = await req.json();
  try {
    const reply = await getAIResponse(message);
    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({ reply: "Sorry, I'm having trouble connecting right now." });
  }
}