import { Post } from '@/entities/post/model';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

export const calculateTotalPage = (totalPostCnt: number) => {
  const totalPageNum =
    totalPostCnt % NUMBER_CONSTANTS.BLOG_POST_PER_PAGE > 0
      ? totalPostCnt / NUMBER_CONSTANTS.BLOG_POST_PER_PAGE + 1
      : totalPostCnt / NUMBER_CONSTANTS.BLOG_POST_PER_PAGE;

  const totalPageNumArr = [];
  for (let i = 1; i <= totalPageNum; i++) {
    totalPageNumArr.push(i);
  }

  return totalPageNumArr;
};
