import { Header } from '@/widgets';
import { ReactNode, Fragment } from 'react';
import { Scaffold, ResponsiveFrame } from '@/shared/ui/layout';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <ResponsiveFrame>
        <Header type="home" />
        {children}
      </ResponsiveFrame>
    </Fragment>
  );
};

export default Layout;
