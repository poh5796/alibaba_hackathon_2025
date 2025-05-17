'use client'

import { useEffect, useState } from "react";
import { Chatbot } from "./components/chatbot";
import { Sidebar } from "./components/sidebar";

export default function Home() {
  

  return (
    <div className="overflow-auto flex h-screen w-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex min-h-screen w-full flex-col items-center justify-between p-8">
        <Chatbot />
      </main>
    </div>
  );
}