// lib/UserProfileContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type UserProfile = {
  name: string;
  age: number;
  occupation: string;
  income: number;
  location: string;
  householdSize: number;
  language: string;
};

type ProfileContextType = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  isLoggedIn: boolean;
};

const UserProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  isLoggedIn: false,
});

export const useUserProfile = () => useContext(UserProfileContext);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user-profile');
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const saveProfile = (profile: UserProfile) => {
    localStorage.setItem('user-profile', JSON.stringify(profile));
    setProfile(profile);
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile: saveProfile, isLoggedIn: !!profile }}>
      {children}
    </UserProfileContext.Provider>
  );
}
