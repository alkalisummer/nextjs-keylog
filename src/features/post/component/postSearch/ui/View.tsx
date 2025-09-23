'use client';

import { Post } from '@/entities/post/model';
import { useSearchParams } from 'next/navigation';
import { Fragment, useState, useEffect, useMemo } from 'react';
import { useIntersectionObserver } from '@/shared/hooks';
import { SearchForm } from '@/entities/post/component/index';
import { SearchTagPost, SearchPostList } from '@/entities/post/component';
import { useInfinitePostsQuery } from '@/entities/post/query';

interface Props {
  initPosts: Post[];
  initPostsTotalCnt: number;
}

export const View = ({ initPosts, initPostsTotalCnt }: Props) => {
  const [postCnt, setPostCnt] = useState(initPostsTotalCnt);

  const searchParams = useSearchParams();
  const tagId = searchParams?.get('tagId') ?? '';
  const tagName = searchParams?.get('tagName');
  const searchWord = searchParams?.get('searchWord') ?? '';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfinitePostsQuery({
    searchWord,
    tagId,
    ...(!searchWord && { initialPage: initPosts }),
  });

  const { setTarget } = useIntersectionObserver({
    onShow: () => {
      if (hasNextPage && !isFetchingNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    once: true,
  });

  const posts: Post[] = useMemo(() => {
    if (!data) return initPosts;
    return data.pages.flatMap((page: Post[]) => page);
  }, [data, initPosts]);

  useEffect(() => {
    setPostCnt(initPostsTotalCnt);
  }, [tagId, tagName]);

  useEffect(() => {
    const firstPage = data?.pages?.[0];
    if (firstPage) {
      const totalItems = firstPage?.[0]?.totalItems;
      setPostCnt(totalItems || posts.length);
    }
  }, [data, posts.length]);

  return (
    <Fragment>
      {tagName ? <SearchTagPost tagName={tagName} postCnt={postCnt} /> : <SearchForm postCnt={postCnt} />}
      <SearchPostList posts={posts} setTarget={setTarget} />
    </Fragment>
  );
};
