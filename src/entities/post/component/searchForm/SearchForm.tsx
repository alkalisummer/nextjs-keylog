'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import css from './searchForm.module.scss';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SearchForm as SearchFormType, SearchSchema } from '../../model';

interface SearchFormProps {
  postCnt: number;
}

export const SearchForm = ({ postCnt }: SearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchWord = searchParams?.get('searchWord') || '';

  const { register, handleSubmit, setValue } = useForm<SearchFormType>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      searchWord: searchWord,
    },
  });

  const onSubmit = async (data: SearchFormType) => {
    const keyword = data.searchWord;
    const params = new URLSearchParams(searchParams?.toString());

    if (keyword) params.set('searchWord', keyword);
    else params.delete('searchWord');

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setValue('searchWord', searchWord);
  }, [searchWord]);

  return (
    <section className={css.module}>
      <form onSubmit={handleSubmit(onSubmit)} className={css.searchForm}>
        <input
          className={css.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          {...register('searchWord')}
        ></input>
        <button type="submit" className={css.searchBtn} aria-label="search-post">
          <FontAwesomeIcon icon={faMagnifyingGlass} className={css.icon} />
        </button>
      </form>
      <div className={css.searchCnt}>
        {searchWord ? (
          <span>
            총 <span>{postCnt}</span>개의 포스트를 찾았습니다.
          </span>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default SearchForm;
