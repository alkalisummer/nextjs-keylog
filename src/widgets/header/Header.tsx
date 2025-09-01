'use client';

import css from './header.module.scss';
import { useAuthenticated } from '@/shared/lib/util';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { AccountMenu } from '../../features/account/ui';

interface HeaderProps {
  type: 'home' | 'blog';
}

export const Header = ({ type = 'home' }: HeaderProps) => {
  const router = useRouter();
  const params = useParams();
  const authorId = params?.userId;
  const isLoggedIn = useAuthenticated();
  const isWritePage = usePathname()?.includes('/write');

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
        {authorId && (
          <span className={css.authorId} onClick={() => router.push(`/${authorId}`)}>
            {authorId}
          </span>
        )}
        {isLoggedIn ? (
          <div className={css.accountMenu}>
            {!isWritePage && (
              <button className={css.writeBtn} onClick={() => router.push(`/write`)}>
                새 글 작성
              </button>
            )}
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
