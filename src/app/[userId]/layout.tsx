'use server';
import { ReactNode } from 'react';
import { BlogContainer } from './container';
import { Header, Sidebar, Article } from '@/widgets';

const Layout = async ({ children, params }: { children: ReactNode; params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  return (
    <BlogContainer>
      <Header type="blog" />
      <Sidebar userId={userId} />
      <Article>{children}</Article>
    </BlogContainer>
  );
};

export default Layout;
