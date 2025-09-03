'use client';

import { Fragment } from 'react';
import css from './articleListSkeleton.module.scss';

interface ArticleListSkeletonProps {
  itemCount?: number;
}

export const ArticleListSkeleton = ({ itemCount = 3 }: ArticleListSkeletonProps) => {
  return (
    <Fragment>
      <div className={css.dateSkeletonWrapper}>
        <div className={css.dateSkeleton}></div>
      </div>
      <div className={css.articleListSkeleton}>
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div key={idx} className={css.articleSkeleton}>
            <div className={css.imageSkeleton}></div>
            <div className={css.infoSkeleton}>
              <div className={css.titleSkeleton}></div>
              <div className={css.titleSecondLineSkeleton}></div>
              <div className={css.bottomSkeleton}>
                <div className={css.companySkeleton}></div>
                <div className={css.dateSeparator}></div>
                <div className={css.pressDateSkeleton}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
