import { Header } from '@/widgets';
import { ReactNode, Fragment } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
};

export default Layout;
