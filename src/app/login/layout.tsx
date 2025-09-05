import { Fragment } from 'react';
import { ResponsiveFrame } from '@/shared/ui/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <ResponsiveFrame>{children}</ResponsiveFrame>
    </Fragment>
  );
}
