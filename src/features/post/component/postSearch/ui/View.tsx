'use client';

import { Post } from '@/entities/post/model';
import { useHome } from '@/app/home/container';
import { getPosts } from '@/entities/post/api';
import { useSearchParams } from 'next/navigation';
import { Fragment, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/shared/hooks';
import { SearchForm } from '@/entities/post/component/index';
import { SearchTagPost, SearchPostList } from '@/entities/post/component';
import { SearchForm as SearchFormType } from '@/entities/post/model';

interface Props {
  initPosts: Post[];
  initPostsTotalCnt: number;
}

export const View = ({ initPosts, initPostsTotalCnt }: Props) => {
  const { selectedTab } = useHome();
  const [pageNum, setPageNum] = useState(1);
  const [searchWord, setSearchWord] = useState('');
  const [posts, setPosts] = useState<Post[]>(initPosts);
  const [postCnt, setPostCnt] = useState(initPostsTotalCnt);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const searchParams = useSearchParams();
  const tagId = searchParams?.get('tagId') ?? '';
  const tagName = searchParams?.get('tagName');

  useEffect(() => {
    setPosts(initPosts);
  }, [tagId, tagName]);

  const { setTarget } = useIntersectionObserver({
    onShow: async () => {
      setPageNum(prev => prev + 1);
      const postsResult = await getPosts({ searchWord: searchWord, tagId: tagId, currPageNum: pageNum + 1 });

      if (!postsResult.ok) throw new Error('getPosts failed');

      setPosts(prev => [...prev, ...postsResult.data]);
    },
    once: true,
  });

  if (selectedTab === 'keyword') return;

  const onSubmit = async (data: SearchFormType) => {
    const keyword = data.searchWord;
    setSearchWord(keyword);
    setPageNum(1);
    setIsSubmitSuccessful(true);

    const postsResult = await getPosts({ searchWord: keyword, tagId: tagId, currPageNum: 1 });
    if (!postsResult.ok) throw new Error('getPosts failed');

    const posts = postsResult.data;
    const totalPosCnt = postsResult.data[0]?.totalItems ?? 0;

    setPosts(posts);
    setPostCnt(totalPosCnt);
  };

  return (
    <Fragment>
      {tagName ? (
        <SearchTagPost tagName={tagName} postCnt={postCnt} />
      ) : (
        <SearchForm onSubmit={onSubmit} isSubmitSuccessful={isSubmitSuccessful} postCnt={postCnt} />
      )}
      <SearchPostList posts={posts} setTarget={setTarget} />
    </Fragment>
  );
};
