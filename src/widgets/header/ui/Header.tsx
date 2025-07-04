'use client';

import Navbar from '../../Navbar';
import css from './header.module.scss';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.logo} onClick={() => router.push('/')}>
          keylog
        </span>
        <Navbar />
      </div>
    </div>
  );
};
