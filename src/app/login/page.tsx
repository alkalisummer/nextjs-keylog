'use server';

import { LoginForm } from '@/features/login/component';

export default async function Page() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
