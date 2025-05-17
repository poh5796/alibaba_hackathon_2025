// components/Chatbot.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "../lib/user-profile-context";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export const Chatbot = () => {
  const { profile, isLoggedIn } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initMessage: Message = {
      role: "assistant",
      content: isLoggedIn
        ? `Hi ${profile?.name}! Based on your profile, I can guide you through services in ${profile?.location}. What do you need help with?`
        : "Hi! How can I help you with government services today?",
    };
    setMessages([initMessage]);
  }, [isLoggedIn, profile]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true)
    setInput("");

    // Simulate API call to PAI or Model Studio
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, profile }),
    });

    const data = await response.json();
    setIsLoading(false)


    setMessages((prev) => [...prev, { role: "assistant", content: data }]);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
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
      <div className="flex gap-2 items-end">
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