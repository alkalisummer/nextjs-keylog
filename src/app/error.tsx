'use client';

import { useEffect } from 'react';
import { ErrorView } from '@/shared/ui/error/ErrorView';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // You may log the error to an error reporting service here
    // console.error(error);
  }, [error]);

  return <ErrorView code={500} />;
}
