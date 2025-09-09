'use client';

import Link from 'next/link';
import css from './postEmpty.module.scss';

export const PostEmpty = () => {
  return (
    <div className={css.module}>
      <h2 className={css.title}>아직 작성하신 글이 없어요.</h2>
      <p className={css.description}>내 블로그의 첫 시작이 될 오늘의 기록을 남겨보세요!</p>
      <Link href="/write" className={css.ctaButton} scroll={false}>
        글쓰기
      </Link>
    </div>
  );
};
