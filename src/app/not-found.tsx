'use client';

import { ErrorView } from '@/shared/ui/error/ErrorView';

export default function NotFound() {
  return <ErrorView code={404} />;
}
