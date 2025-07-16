'use client';

import css from './blogPostList.module.scss';
import { User } from '@/entities/user/model';
import { Post } from '@/entities/post/model';
import { BlogPostItem } from '@/entities/post/ui';
import { PostPagination } from '@/entities/post/ui';

interface BlogPostListProps {
  author: User;
  posts: Post[];
}

export const BlogPostList = ({ author, posts }: BlogPostListProps) => {
  const totalItems = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      {posts?.map((post: any) => {
        return <BlogPostItem key={post.postId} post={post} userId={author.userId} />;
      })}
      <PostPagination totalPageNum={totalItems} />
    </div>
  );
};
