import { Header } from '@/widgets';
import { ReactNode } from 'react';
import { ResponsiveFrame } from '@/shared/ui/layout';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <ResponsiveFrame>
      <Header type="home" />
      {children}
    </ResponsiveFrame>
  );
};

export default Layout;
