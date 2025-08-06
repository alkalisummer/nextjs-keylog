'use client';

import Navbar from '../Navbar';
import css from './header.module.scss';
import { useRouter } from 'next/navigation';
import { AccountMenu } from '../accountMenu/ui';
import { isAuthenticated } from '@/shared/lib/util';

interface HeaderProps {
  type: 'home' | 'blog';
}

export const Header = ({ type = 'home' }: HeaderProps) => {
  const isLoggedIn = isAuthenticated();
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
        {isLoggedIn ? (
          <div className={css.accountMenu}>
            <button className={css.writeBtn}>새 글 작성</button>
            <AccountMenu />
          </div>
        ) : (
          <button className={css.loginBtn} onClick={() => router.push(`/login?redirect=${window.location.href}`)}>
            로그인
          </button>
        )}
      </div>
    </header>
  );
};
