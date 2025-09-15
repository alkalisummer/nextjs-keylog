'use client';

import { HydrationBoundary, HydrationBoundaryProps } from '@tanstack/react-query';

export function HydrateClient(props: HydrationBoundaryProps) {
  return <HydrationBoundary {...props} />;
}
