'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import css from './scaffold.module.scss';

export const Scaffold = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname?.includes('home');

  return <div className={`${css.module} ${isHome ? css.homeColor : ''}`}>{children}</div>;
};
