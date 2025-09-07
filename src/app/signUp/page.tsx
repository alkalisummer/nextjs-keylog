'use server';
import { SignupForm } from '@/features/signup/component';

export default async function Page() {
  return (
    <main>
      <SignupForm />
    </main>
  );
}
