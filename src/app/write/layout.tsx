import { Viewport } from 'next';
import { Fragment } from 'react';
import { Header } from '@/widgets';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <Header type="blog" />
      {children}
    </Fragment>
  );
}

export const viewport: Viewport = {
  themeColor: '#fff',
};
