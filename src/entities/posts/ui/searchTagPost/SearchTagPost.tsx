'use client';

import css from './searchTagPost.module.scss';

interface SearchTagPostProps {
  tagName: string;
  postCnt: number;
}

export const SearchTagPost = ({ tagName, postCnt }: SearchTagPostProps) => {
  return (
    <div className={css.searchTag}>
      <span className={css.searchTagName}>{`# ${tagName}`}</span>
      <div className={css.searchTagDesc}>
        <span>
          총 <span className={css.searchTagCnt}>{postCnt}</span>개의 포스트
        </span>
      </div>
    </div>
  );
};
