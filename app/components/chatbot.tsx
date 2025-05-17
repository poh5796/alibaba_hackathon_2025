// components/Chatbot.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Government Service Assistant. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return;
    const apiKey = 'sk-55b97806532b4dfeb709ac62b477f881';

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true)
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setIsLoading(false)

    const reply: string = (() => {
      if (typeof data.reply === "string") return data.reply;
      if (data.reply && Array.isArray(data.reply.choices)) {
        return data.reply.choices[0]?.message?.content || "No reply";
      }
      return "Invalid response format";
    })();


    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1 mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 my-2 rounded-md max-w-[70%] whitespace-pre-wrap ${msg.role === "user"
              ? "ml-auto bg-primary text-primary-foreground"
              : "bg-muted"
              }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {isLoading && <div className="text-muted-foreground">Loading...</div>}
      </ScrollArea>
      <div className="flex gap-2 items-end pb-8">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about government services..."
          rows={3}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};