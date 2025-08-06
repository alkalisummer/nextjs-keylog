import { signOut } from 'next-auth/react';

export const logout = async () => {
  const callbackUrl = window.location.href;

  await signOut({ redirect: true, callbackUrl: callbackUrl });
};
