'use server';

import { LoginForm } from '@/features/login/ui';

export const Page = async () => {
  return (
    <main>
      <LoginForm />
    </main>
  );
};

export default Page;
