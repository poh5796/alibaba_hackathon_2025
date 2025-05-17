// types/UserProfile.ts
export type User = {
    name: string;
    age: number;
    occupation: string;
    income: number;
    location: string;
    householdSize: number;
    language: 'en' | 'ms' | 'zh' | 'ta';
    interestedServices: string[]; // e.g., ['welfare', 'tax', 'education']
  }
  