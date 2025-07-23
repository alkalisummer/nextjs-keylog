import { signIn } from 'next-auth/react';

export const login = async (id: string, password: string) => {
  return await signIn('credentials', {
    redirect: false,
    id: id.replaceAll(' ', ''),
    password: password,
  });
};
