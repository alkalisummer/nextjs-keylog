'use client';

import Link from 'next/link';
import css from './blogPostList.module.scss';
import { User } from '@/entities/user/model';
import { Post } from '@/entities/post/model';
import { useSearchParams } from 'next/navigation';
import { useCheckAuth } from '@/shared/lib/hooks';
import { HashtagButtons } from '@/entities/hashtag/ui';
import { BlogPostItem, PostPagination } from '@/entities/post/ui';

interface BlogPostListProps {
  author: User;
  posts: Post[];
}

export const BlogPostList = ({ author, posts }: BlogPostListProps) => {
  const searchParms = useSearchParams();
  const tagId = searchParms?.get('tagId');
  const isAuthorized = useCheckAuth(author.userId);

  const hashtagName = posts[0]?.hashtagName ?? '';
  const totalItems = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      <div className={css.headerDiv}>
        <img
          src={author.userThmbImgUrl ? author.userThmbImgUrl : '../../icon/person.png'}
          className={css.profileImg}
          alt="profile img"
        />
        <span className={css.blogName}>{author.userBlogName}</span>
        <span className={css.headerTitle}>{author.userNickname}</span>
      </div>
      <div className={css.post}>
        <div className={css.header}>
          <span className={css.postCnt}>{`${
            tagId ? `'${hashtagName}' 태그의 글 목록` : '전체 글'
          }(${totalItems})`}</span>
          {isAuthorized && (
            <div className={css.headerBtn}>
              <Link href={`/write?keyword=true`}>
                <button className={css.createBtn}>글쓰기</button>
              </Link>
            </div>
          )}
        </div>

        {posts?.map((post: any) => {
          return <BlogPostItem key={post.postId} post={post} userId={author.userId} />;
        })}
      </div>
      <PostPagination totalPageNum={totalItems} />
    </div>
  );
};
