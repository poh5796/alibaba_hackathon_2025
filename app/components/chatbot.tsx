"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "../lib/user-profile-context";

type Message = {
  role: "assistant" | "user";
  content: string;
  references?: Document[];
};

type Document = {
  images: string[];
  doc_name: string;
  text: string;
  index_id: string;
  title: string;
  doc_id: string;
  _score_with_weight?: number;
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
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages, profile }),
    });

    const res = await response.json();

    console.log(res)
    setIsLoading(false);
    setMessages((prev) => [...prev, { role: "assistant", content: res.content, references: res.references }]);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <ScrollArea className="flex-1 mb-4 space-y-4">
        {messages.map((msg, index) => {
         const superscriptMap = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"];

         const contentWithUnicode = msg.content.replace(/<ref>\[(\d+)\]<\/ref>/g, (_, num) => {
           const index = parseInt(num) - 1;
           return superscriptMap[index] || `(${num})`;
         });
         
          return (
            <div
              key={index}
              className={`p-4 my-2 rounded-md max-w-[70%] whitespace-pre-wrap ${msg.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
                }`}
            >
              <ReactMarkdown>{contentWithUnicode}</ReactMarkdown>
              {msg.role === "assistant" && msg.references && msg.references.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground border-t pt-2 space-y-1">
                  <div className="font-semibold">References:</div>
                  {msg.references.map((ref, idx) => (
                    <div key={idx}>
                      {idx + 1}. <span className="italic">{ref.title}</span> — {ref.doc_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};