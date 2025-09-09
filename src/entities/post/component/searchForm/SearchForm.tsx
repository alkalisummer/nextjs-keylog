'use client';

import { useForm } from 'react-hook-form';
import css from './searchForm.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SearchForm as SearchFormType, SearchSchema } from '../../model';

interface SearchFormProps {
  onSubmit: (data: SearchFormType) => Promise<void>;
  isSubmitSuccessful: boolean;
  postCnt: number;
}

export const SearchForm = ({ onSubmit, isSubmitSuccessful, postCnt }: SearchFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormType>({
    resolver: zodResolver(SearchSchema),
  });

  return (
    <section className={css.module}>
      <form onSubmit={handleSubmit(onSubmit)} className={css.searchForm}>
        <input
          className={css.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          {...register('searchWord')}
        ></input>
        <button className={css.searchBtn} type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} className={css.icon} />
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
    </section>
  );
};

export default SearchForm;
