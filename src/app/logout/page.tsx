'use client';

import { signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

// server-side에서 next auth signout 을 위한 경유 페이지
export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  console.log('custom logout page, callbackUrl:', callbackUrl);
  (async () => {
    await signOut({ redirect: true, callbackUrl });
  })();
}
