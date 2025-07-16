'use client';

import Link from 'next/link';
import { User } from '@/entities/user/model';
import { Post } from '@/entities/post/model';
import css from './blogPostHeader.module.scss';
import { useCheckAuth } from '@/shared/lib/hooks';
import { useSearchParams } from 'next/navigation';

interface BlogPostHeaderProps {
  author: User;
  posts: Post[];
}

export const BlogPostHeader = ({ author, posts }: BlogPostHeaderProps) => {
  const searchParms = useSearchParams();
  const tagId = searchParms?.get('tagId');
  const isAuthorized = useCheckAuth(author.userId);

  const hashtagName = posts[0]?.hashtagName ?? '';
  const totalItems = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.postCnt}>{`${tagId ? `'${hashtagName}' 태그의 글 목록` : '전체 글'}(${totalItems})`}</span>
        {isAuthorized && (
          <div className={css.headerBtn}>
            <Link href={`/write?keyword=true`}>
              <button className={css.createBtn}>글쓰기</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
