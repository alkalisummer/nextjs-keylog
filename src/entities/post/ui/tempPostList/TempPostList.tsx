'use client';

import { Post } from '../../model';
import css from './tempPostList.module.scss';

interface TempPostListProps {
  posts: Post[];
}

export const TempPostList = ({ posts }: TempPostListProps) => {
  return <div>TempPostList</div>;
};
