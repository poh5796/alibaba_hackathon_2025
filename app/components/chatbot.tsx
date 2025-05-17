// components/Chatbot.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import OpenAI from "openai";

interface Message {
  role: "user" | "assistant";
  content: string | ChatCompletionResponse;
}

export type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string | null;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
    };
  };
  choices: Array<{
    index: number;
    message: {
      role: "assistant" | "user" | "system";
      content: string;
    };
    finish_reason: string;
    logprobs: unknown | null;
  }>;
};


export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Government Service Assistant. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate API call to PAI or Model Studio
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    console.log(data)
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply || "I'm here to help!" },
    ]);
  };

  return (
    <div className="flex flex-col h-full p-4 w-full">
      <ScrollArea className="flex-1 mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-md max-w-[70%] ${msg.role === "user"
              ? "ml-auto bg-primary text-primary-foreground"
              : "bg-muted"
              }`}
          >
            {typeof msg.content === 'string' && msg.content}
            {typeof msg.content !== 'string' && msg.content.choices.map((choice, index) => {
              return <span key={index}>{choice.message.content}</span>
            })}
          </div>
        ))}
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about government services..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};