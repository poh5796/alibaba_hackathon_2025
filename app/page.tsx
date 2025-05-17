'use client';

import { Chatbot } from './components/chatbot';
import { Sidebar } from './components/sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUserProfile } from './lib/user-profile-context';

export default function Home() {
  const { isLoggedIn, profile } = useUserProfile();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/profile'); // Redirect to form page
  };
  
  return (
    <div className="overflow-auto flex h-screen w-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex min-h-screen w-full flex-col items-center justify-between p-8">
        <div className="w-full flex justify-end mb-4">
          {!isLoggedIn ? (
            <Button onClick={handleLoginClick}>Enter Personal Info</Button>
          ) : (
            <div className="text-sm text-muted-foreground">Logged in as {profile?.name}</div>
          )}
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
