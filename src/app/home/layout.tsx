import { Header } from '@/widgets';
import { ReactNode, Fragment } from 'react';
import { Scaffold, ResponsiveFrame } from '@/shared/ui/layout';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Scaffold>
        <ResponsiveFrame>
          <Header />
          {children}
        </ResponsiveFrame>
      </Scaffold>
    </Fragment>
  );
};

export default Layout;
