import { ReactNode } from 'react';
import { Header } from '@/widgets/header';
import { Fragment } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
};

export default Layout;
