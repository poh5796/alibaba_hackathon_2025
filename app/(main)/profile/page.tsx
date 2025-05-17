'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/app/lib/user-profile-context';

type FormData = {
  name: string;
  age: number;
  occupation: string;
  income: number;
  location: string;
  householdSize: number;
  language: 'en' | 'ms' | 'zh' | 'ta';
};

export default function ProfileFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { setProfile } = useUserProfile(); // Save to context + localStorage
  const router = useRouter();              // Navigation back to chatbot

  const onSubmit = (data: FormData) => {
    setProfile(data);   // Save user profile
    router.push('/');   // Go back to chatbot main page
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Enter Your Details</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: true })} placeholder="e.g. John" />
          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" {...register('age', { required: true, min: 0 })} />
          {errors.age && <p className="text-red-500 text-sm">Valid age is required</p>}
        </div>

        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" {...register('occupation', { required: true })} />
          {errors.occupation && <p className="text-red-500 text-sm">Occupation is required</p>}
        </div>

        <div>
          <Label htmlFor="income">Monthly Income (MYR)</Label>
          <Input id="income" type="number" {...register('income', { required: true })} />
          {errors.income && <p className="text-red-500 text-sm">Income is required</p>}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location', { required: true })} placeholder="e.g. Selangor" />
          {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
        </div>

        <div>
          <Label htmlFor="householdSize">Household Size</Label>
          <Input id="householdSize" type="number" {...register('householdSize', { required: true })} />
          {errors.householdSize && <p className="text-red-500 text-sm">Household size is required</p>}
        </div>

        <div>
          <Label htmlFor="language">Preferred Language</Label>
          <select
            id="language"
            {...register('language', { required: true })}
            className="w-full border rounded px-2 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="ms">Bahasa Malaysia</option>
            <option value="zh">中文</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>

        <Button type="submit" className="mt-4 w-full">
          Submit & Continue
        </Button>
      </form>
    </div>
  );
}
