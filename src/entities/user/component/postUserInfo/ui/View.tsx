'use client';

import Image from 'next/image';
import css from './view.module.scss';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { getUser } from '@/entities/user/api';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const { data: userRes } = useQuery({
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  });

  if (!userRes?.ok) {
    throw new Error('User fetch error');
  }

  const author = userRes.data;

  return (
    <div className={css.module}>
      <Image
        src={author.userThmbImgUrl ? author.userThmbImgUrl : '/icon/person.png'}
        width={90}
        height={90}
        quality={100}
        priority
        className={css.profileImg}
        alt="profile img"
      />
      <span className={css.blogName}>{author.userBlogName}</span>
      <span className={css.headerTitle}>{author.userNickname}</span>
    </div>
  );
};

export default View;
