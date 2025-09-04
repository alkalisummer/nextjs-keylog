'use client';

import css from './view.module.scss';
import { Post } from '@/entities/post/model';
import { getPosts } from '@/entities/post/api';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { queryKey } from '@/app/provider/query/lib';
import { BlogPostItem } from '@/entities/post/component';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { PostPagination } from '@/entities/post/component';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const searchParams = useSearchParams();
  const pageNum = searchParams?.get('pageNum') || '1';
  const tagId = searchParams?.get('tagId') || '';
  const tempYn = searchParams?.get('tempYn') || 'N';

  const { data: postsRes } = useQuery({
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId, tempYn: tempYn }),
    queryFn: () => getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId, tempYn: tempYn }),
  });

  const posts = postsRes?.data || [];
  const totalItems = posts[0]?.totalItems ?? 0;
  const totalPageNum = Math.ceil(totalItems / NUMBER_CONSTANTS.BLOG_POST_PER_PAGE);

  return (
    <div className={css.module}>
      {posts?.map((post: Post) => {
        return <BlogPostItem key={post.postId} post={post} userId={userId} />;
      })}
      <PostPagination totalPageNum={totalPageNum} />
    </div>
  );
};

export default View;
