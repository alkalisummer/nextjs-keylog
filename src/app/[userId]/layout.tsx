import { ReactNode } from 'react';
import type { Viewport } from 'next';
import { Header, Sidebar, Article } from '@/widgets';

const Layout = async ({ children, params }: { children: ReactNode; params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  return (
    <>
      <Header type="blog" />
      <Sidebar userId={userId} />
      <Article>{children}</Article>
    </>
  );
};

export default Layout;

export const viewport: Viewport = {
  themeColor: '#fff',
};
