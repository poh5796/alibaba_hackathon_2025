'use client';

import { Chatbot } from './components/chatbot';
import { Sidebar } from './components/sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUserProfile } from './lib/user-profile-context';
import { useState } from 'react';

export default function Home() {
  const { isLoggedIn, profile, logout } = useUserProfile();
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'melayu'>('en');

  const handleLoginClick = () => {
    router.push('/profile'); // Redirect to form page
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'melayu' : 'en'));
    // Optionally add logic to persist language choice, e.g., context or i18n
  };


  return (
    <div className="overflow-auto flex h-screen w-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex min-h-screen w-full flex-col p-8 relative">
        {/* Top panel with language on left and auth actions on right */}
        <div className="w-full flex justify-between items-center mb-4">
          <Button variant="outline" onClick={toggleLanguage}>
            {language === 'en' ? 'English' : 'Melayu'}
          </Button>
          <div className="flex gap-2">
            {!isLoggedIn ? (
              <Button onClick={handleLoginClick}>Enter Personal Info</Button>
            ) : (
              <>
                <div className="text-sm text-muted-foreground flex items-center">
                  Logged in as {profile?.name}
                </div>
                <Button variant="destructive" onClick={logout}>Logout</Button>
              </>
            )}
          </div>
        </div>
        <Chatbot language={language} />
      </main>
    </div>
  );
}
