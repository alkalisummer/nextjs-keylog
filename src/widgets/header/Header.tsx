'use client';

import Link from 'next/link';
import css from './header.module.scss';
import { useAuthenticated } from '@/shared/lib/util';
import { AccountMenu } from '../../features/account/component';
import { usePathname, useSearchParams } from 'next/navigation';

interface HeaderProps {
  type: 'home' | 'blog';
  authorId: string;
  userNickname?: string;
}

export const Header = ({ type = 'home', authorId, userNickname }: HeaderProps) => {
  const isLoggedIn = useAuthenticated();
  const pathname = usePathname();
  const isWritePage = pathname?.includes('/write') ?? false;
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') ?? 'keyword';
  const search = searchParams?.toString();
  const redirectPath = search ? `${pathname}?${search}` : pathname;

  return (
    <header className={css.module}>
      <div className={`${css.header} ${type === 'blog' ? css.blogHeader : ''}`}>
        <Link className={css.logo} href={`/home?tab=${tab}`}>
          keylog
        </Link>
        {userNickname && (
          <Link className={css.authorId} href={`/${authorId}`}>
            {userNickname}
          </Link>
        )}
        {isLoggedIn ? (
          <div className={css.accountMenu}>
            {!isWritePage && (
              <Link href={`/write`}>
                <button className={css.writeBtn}>새 글 작성</button>
              </Link>
            )}
            <AccountMenu />
          </div>
        ) : (
          <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`}>
            <button className={css.loginBtn}>로그인</button>
          </Link>
        )}
      </div>
    </header>
  );
};
