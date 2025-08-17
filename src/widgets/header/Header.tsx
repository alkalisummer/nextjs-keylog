'use client';

import css from './header.module.scss';
import { useAuthenticated } from '@/shared/lib/util';
import { useRouter, useParams } from 'next/navigation';
import { AccountMenu } from '../../features/account/ui';

interface HeaderProps {
  type: 'home' | 'blog';
}

export const Header = ({ type = 'home' }: HeaderProps) => {
  const router = useRouter();
  const params = useParams();
  const authorId = params?.userId;
  const isLoggedIn = useAuthenticated();

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
            <button className={css.writeBtn} onClick={() => router.push(`/write?keyword=true`)}>
              새 글 작성
            </button>
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
