'use client';

import { Fragment } from 'react';
import css from './postSearchSkeleton.module.scss';

interface PostSearchSkeletonProps {
  itemCount?: number;
}

const DEFAULT_ITEM_COUNT = 8;

export const PostSearchSkeleton = ({ itemCount = DEFAULT_ITEM_COUNT }: PostSearchSkeletonProps) => {
  return (
    <Fragment>
      <div className={css.headerSkeleton}>
        <div className={css.searchInputSkeleton}></div>
      </div>
      <section className={css.gridSkeleton}>
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div key={idx} className={css.cardSkeleton}>
            <div className={css.imageSkeleton}></div>
            <div className={css.contentSkeleton}>
              <div className={css.titleSkeleton}></div>
              <div className={css.summarySkeleton}></div>
              <div className={css.summarySkeletonShort}></div>
              <div className={css.bottomLineSkeleton}></div>
            </div>
            <div className={css.authorSkeleton}>
              <div className={css.userAreaSkeleton}>
                <div className={css.avatarSkeleton}></div>
                <div className={css.usernameSkeleton}></div>
              </div>
              <div className={css.likeSkeleton}></div>
            </div>
          </div>
        ))}
      </section>
    </Fragment>
  );
};
