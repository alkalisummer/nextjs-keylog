'use client';

import { signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

// server-side에서 next auth signout 을 위한 경유 페이지
export default function Page() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('callbackUrl') || '/';
  const decoded = decodeURIComponent(raw);
  let callbackUrl = decoded;
  try {
    const url = new URL(decoded, window.location.origin);
    if (url.origin === window.location.origin) {
      callbackUrl = url.pathname + url.search + url.hash;
    }
  } catch {}
  (async () => {
    await signOut({ redirect: true, callbackUrl });
  })();
}
