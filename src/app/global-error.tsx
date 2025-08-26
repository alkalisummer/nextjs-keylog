'use client';

import { ErrorView } from '@/shared/ui/error/ErrorView';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <ErrorView code={500} />
      </body>
    </html>
  );
}
