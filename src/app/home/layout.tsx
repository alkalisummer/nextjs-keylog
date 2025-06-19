import { ReactNode } from 'react';
import { Header } from '@/widgets/header';
import { Fragment } from 'react';
import { Home } from '@/widgets/layout';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      <Home>{children}</Home>
    </Fragment>
  );
};

export default Layout;
