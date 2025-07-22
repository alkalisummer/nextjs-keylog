import { ReactNode, Fragment } from 'react';
import { ResponsiveFrame } from '@/shared/ui/layout';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <ResponsiveFrame>{children}</ResponsiveFrame>
    </Fragment>
  );
};

export default Layout;
