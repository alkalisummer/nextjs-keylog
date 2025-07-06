import { PropsWithChildren, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface AsyncBoundaryProps {
  pending: ReactNode | null;
  error: ReactNode | null;
}

export const AsyncBoundary = ({ pending, error, children }: PropsWithChildren<AsyncBoundaryProps>) => {
  return (
    <ErrorBoundary fallback={error}>
      <Suspense fallback={pending}>{children}</Suspense>
    </ErrorBoundary>
  );
};
