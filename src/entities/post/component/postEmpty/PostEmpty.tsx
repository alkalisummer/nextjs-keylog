'use client';

import Link from 'next/link';
import css from './postEmpty.module.scss';

export const PostEmpty = ({ tempYn }: { tempYn: string }) => {
  const title = tempYn === 'Y' ? '작성하신 임시 글이 없습니다.' : '아직 작성하신 글이 없습니다.';
  return (
    <div className={css.module}>
      <h2 className={css.title}>{title}</h2>
      <p className={css.description}>새로운 글을 작성해보세요!</p>
      <Link href="/write" className={css.ctaButton}>
        글쓰기
      </Link>
    </div>
  );
};
