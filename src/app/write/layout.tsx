import { Fragment } from 'react';
import { Header } from '@/widgets';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <Header type="blog" />
      {children}
    </Fragment>
  );
};

export default Layout;
