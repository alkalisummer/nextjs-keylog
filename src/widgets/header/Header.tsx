'use client';

import Link from 'next/link';
import css from './header.module.scss';
import { useAuthenticated } from '@/shared/lib/util';
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation';
import { AccountMenu } from '../../features/account/component';

interface HeaderProps {
  type: 'home' | 'blog';
}

export const Header = ({ type = 'home' }: HeaderProps) => {
  const router = useRouter();
  const params = useParams();
  const authorId = params?.userId;
  const isLoggedIn = useAuthenticated();
  const isWritePage = usePathname()?.includes('/write');
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') ?? 'keyword';

  return (
    <header className={css.module}>
      <div className={`${css.header} ${type === 'blog' ? css.blogHeader : ''}`}>
        <Link className={css.logo} href={`/home?tab=${tab}`} scroll={false}>
          keylog
        </Link>
        {authorId && (
          <Link className={css.authorId} href={`/${authorId}`} scroll={false}>
            {authorId}
          </Link>
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
