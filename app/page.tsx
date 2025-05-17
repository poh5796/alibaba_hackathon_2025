import { Chatbot } from "./components/chatbot";
import { Sidebar } from "./components/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Chatbot />
      </main>
    </div>
  );
}