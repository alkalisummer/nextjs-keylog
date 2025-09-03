'use client';

import css from './postPagination.module.scss';
import { calculateTotalPage } from '@/entities/post/lib';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

interface PostPaginationProps {
  totalPageNum: number;
}

export const PostPagination = ({ totalPageNum }: PostPaginationProps) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const userId = params?.userId;
  const pageNum = searchParams?.get('pageNum') || '1';
  const tempYn = searchParams?.get('tempYn');
  const pageNavigationNumArr = calculateTotalPage(totalPageNum);

  const handlePagination = (pageNum: number | null, totalPageNum: number) => {
    if (pageNum && pageNum > 0 && pageNum <= totalPageNum) {
      router.push(`/${userId}?pageNum=${pageNum}${tempYn ? `&tempYn=${tempYn}` : ''}`);
    }
  };

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
