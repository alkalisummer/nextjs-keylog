'use server';

import { LoginForm } from '@/features/login/component';

export default async function Page() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}

export const generateMetadata = async () => {
  return {
    title: '로그인',
    description: '로그인',
  };
};
