'use server';

import { LoginForm } from '@/features/login/component';

export const Page = async () => {
  return (
    <main>
      <LoginForm />
    </main>
  );
};

export default Page;
