'use client';

import { Fragment, useState } from 'react';
import { Post } from '@/entities/post/model';
import { getPosts } from '@/entities/post/api';
import { useSearchParams } from 'next/navigation';
import { SearchForm } from '@/entities/post/ui/index';
import { useIntersectionObserver } from '@/shared/lib/hooks';
import { SearchPostList } from '@/entities/post/ui/searchPostList/SearchPostList';
import { SearchForm as SearchFormType } from '@/entities/post/model';
import { SearchTagPost } from '@/entities/post/ui/searchTagPost/SearchTagPost';

interface SearchPostProps {
  initPosts: Post[];
  initPostsTotalCnt: number;
}

export const SearchPost = ({ initPosts, initPostsTotalCnt }: SearchPostProps) => {
  const [pageNum, setPageNum] = useState(1);
  const [searchWord, setSearchWord] = useState('');
  const [posts, setPosts] = useState<Post[]>(initPosts);
  const [postCnt, setPostCnt] = useState(initPostsTotalCnt);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const searchParams = useSearchParams();
  const tagId = searchParams?.get('tagId') ?? '';
  const tagName = searchParams?.get('tagName');

  const { setTarget } = useIntersectionObserver({
    onShow: async () => {
      setPageNum(prev => prev + 1);
      const postsResult = await getPosts({ searchWord: searchWord, tagId: tagId, currPageNum: pageNum + 1 });

      if (!postsResult.ok) throw new Error('getPosts failed');

      setPosts(prev => [...prev, ...postsResult.data]);
    },
    once: true,
  });

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
