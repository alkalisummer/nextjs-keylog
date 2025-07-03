'use client';

import { Post } from '../../model';
import { getPosts } from '../../api';
import { useForm } from 'react-hook-form';
import { Fragment, useState } from 'react';
import css from './searchPost.module.scss';
import { useSearchParams } from 'next/navigation';
import { PostLists } from '../postLists/PostLists';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchForm, SearchSchema } from '../../model';
import { useIntersectionObserver } from '@/shared/lib/hooks';
import { SearchTagPost } from '../searchTagPost/SearchTagPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface SearchPostProps {
  initPosts: Post[];
  initPostsTotalCnt: number;
}

export const SearchPost = ({ initPosts, initPostsTotalCnt }: SearchPostProps) => {
  const [pageNum, setPageNum] = useState(1);
  const [searchWord, setSearchWord] = useState('');
  const [posts, setPosts] = useState<Post[]>(initPosts);
  const [postCnt, setPostCnt] = useState(initPostsTotalCnt);

  const searchParams = useSearchParams();
  const tagId = searchParams?.get('tagId') ?? '';
  const tagName = searchParams?.get('tagName');

  const { setTarget, isIntersecting } = useIntersectionObserver({
    onShow: async () => {
      setPageNum(prev => prev + 1);
      const posts = await getPosts({ searchWord: searchWord, tagId: tagId, currPageNum: pageNum + 1 });

      if (!posts.ok) throw new Error('getPosts failed');

      setPosts(prev => [...prev, ...posts.data]);
      setPostCnt(posts.data.length);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(SearchSchema),
  });

  const onSubmit = (data: SearchForm) => {
    const keyword = data.searchWord;
    setSearchWord(keyword);
    getPosts({ searchWord: keyword, tagId: tagId, currPageNum: 1 });
  };

  return (
    <Fragment>
      {tagName ? (
        <SearchTagPost tagName={tagName} postCnt={postCnt} />
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className={css.searchForm}>
            <input
              className={css.searchInput}
              type="text"
              placeholder="검색어를 입력하세요"
              {...register('searchWord')}
            ></input>
            <button className={css.searchBtn} type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
          <div className={css.searchCnt}>
            {isSubmitSuccessful ? (
              <span>
                총 <span>{postCnt}</span>개의 포스트를 찾았습니다.
              </span>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
      <PostLists posts={posts} setTarget={setTarget} />
    </Fragment>
  );
};
