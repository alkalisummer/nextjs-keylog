'use client';

import { ReactNode } from 'react';
import css from './scaffold.module.scss';
import { usePathname } from 'next/navigation';

export const Scaffold = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname?.includes('home');

  return (
    <div id="scaffold" data-scroll-root className={`${css.module} ${isHome ? css.homeColor : ''}`}>
      {children}
    </div>
  );
};
