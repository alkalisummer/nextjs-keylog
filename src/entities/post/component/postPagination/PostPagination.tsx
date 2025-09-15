'use client';

import { useEffect } from 'react';
import css from './postPagination.module.scss';
import { useScrollRestoration } from '@/shared/hooks';
import { calculateTotalPage } from '@/entities/post/lib';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

interface PostPaginationProps {
  totalPageNum: number;
}

export const PostPagination = ({ totalPageNum }: PostPaginationProps) => {
  const { saveScrollPos, restoreScrollPos } = useScrollRestoration({
    scrollElementId: 'article',
    extendQueryParams: true,
  });
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const userId = params?.userId;
  const pageNum = searchParams?.get('pageNum') || '1';
  const tempYn = searchParams?.get('tempYn');
  const pageNavigationNumArr = calculateTotalPage(totalPageNum);

  const handlePagination = (pageNum: number | null, totalPageNum: number) => {
    saveScrollPos();
    if (pageNum && pageNum > 0 && pageNum <= totalPageNum) {
      router.push(`/${userId}?${pageNum !== 1 ? `pageNum=${pageNum}` : ''}${tempYn ? `&tempYn=${tempYn}` : ''}`);
    }
  };

  useEffect(() => {
    restoreScrollPos();
  }, []);

  return (
    <div className={css.module}>
      <span className={css.prev} onClick={() => handlePagination(Number(pageNum) - 1, totalPageNum)}>
        <span className={css.arrow}>&lt;</span> &nbsp;&nbsp;Prev
      </span>

      {pageNavigationNumArr.map((pageNumber: number, idx: number) => {
        const isSelected = Number(pageNum) === pageNumber;
        return (
          <span
            key={idx}
            className={isSelected ? `${css.num} ${css.selected}` : css.num}
            onClick={() => handlePagination(pageNumber, totalPageNum)}
          >
            {pageNumber}
          </span>
        );
      })}

      <span className={css.next} onClick={() => handlePagination(Number(pageNum) + 1, totalPageNum)}>
        Next&nbsp;&nbsp; <span className={css.arrow}>&gt;</span>
      </span>
    </div>
  );
};
