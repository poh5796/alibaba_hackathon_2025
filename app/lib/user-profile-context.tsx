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
  logout: () => void;
  setLanguage: (language: string) => void;
};

const UserProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  isLoggedIn: false,
  logout: () => {},
  setLanguage: () => {},
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

  const logout = () => {
    localStorage.removeItem('user-profile');
    setProfile(null);
  };

  const setLanguage = (language: string) => {
    if (profile) {
      const updated = { ...profile, language };
      saveProfile(updated);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile: saveProfile,
        isLoggedIn: !!profile,
        logout,
        setLanguage,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
