import { Viewport } from 'next';
import { ReactNode } from 'react';
import { Header } from '@/widgets';
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

export const viewport: Viewport = {
  themeColor: '#f8f9fa',
};
