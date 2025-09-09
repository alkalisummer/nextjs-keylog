'use server';

import { SignupForm } from '@/features/signup/component';

export default async function Page() {
  return (
    <main>
      <SignupForm />
    </main>
  );
}

export const generateMetadata = async () => {
  return {
    title: '회원가입',
    description: '회원가입',
  };
};
