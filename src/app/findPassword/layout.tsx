import { Viewport } from 'next';
import { Fragment } from 'react';
import { ResponsiveFrame } from '@/shared/ui/layout';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <ResponsiveFrame>{children}</ResponsiveFrame>
    </Fragment>
  );
};

export default Layout;

export const viewport: Viewport = {
  themeColor: '#fff',
};
