'use client'

import { useEffect, useState } from "react";
import { Chatbot } from "./components/chatbot";
import { Sidebar } from "./components/sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { GoogleSignInButton } from "./components/google-signin-button";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex min-h-screen w-full flex-col items-center justify-between p-8">
        {!user && <GoogleSignInButton />}
        {user ? (
          <p>Welcome, {user.email}</p>
        ) : (
          <p>You are not signed in.</p>
        )}
        <Chatbot />

      </main>
    </div>
  );
}