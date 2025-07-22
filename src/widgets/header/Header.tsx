'use client';

import Navbar from '../Navbar';
import css from './header.module.scss';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  type: 'home' | 'blog';
}

export const Header = ({ type = 'home' }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className={css.module}>
      <div className={`${css.header} ${type === 'blog' ? css.blogHeader : ''}`}>
        <span
          className={css.logo}
          onClick={() => {
            router.push('/');
          }}
        >
          keylog
        </span>
        <Navbar />
      </div>
    </header>
  );
};
