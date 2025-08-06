'use client';

import css from './blogPostList.module.scss';
import { User } from '@/entities/user/model';
import { Post } from '@/entities/post/model';
import { getPosts } from '@/entities/post/api';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { BlogPostItem } from '@/entities/post/ui';
import { PostPagination } from '@/entities/post/ui';
import { queryKey } from '@/app/provider/query/lib';

interface BlogPostListProps {
  author: User;
}

export const BlogPostList = ({ author }: BlogPostListProps) => {
  const searchParams = useSearchParams();
  const pageNum = searchParams?.get('pageNum') || '1';
  const tagId = searchParams?.get('tagId') || '';
  const tempYn = searchParams?.get('tempYn') || 'N';

  const { data: postsRes } = useQuery({
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: author.userId, tagId: tagId, tempYn: tempYn }),
    queryFn: () => getPosts({ currPageNum: Number(pageNum), authorId: author.userId, tagId: tagId, tempYn: tempYn }),
  });

  const posts = postsRes?.data || [];
  const totalItems = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      {posts?.map((post: Post) => {
        return <BlogPostItem key={post.postId} post={post} userId={author.userId} />;
      })}
      <PostPagination totalPageNum={totalItems} />
    </div>
  );
};
