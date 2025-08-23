'use client';

import Image from 'next/image';
import { User } from '@/entities/user/model';
import css from './postUserInfo.module.scss';

interface PostUserInfoProps {
  author: User;
}

export const PostUserInfo = ({ author }: PostUserInfoProps) => {
  return (
    <div className={css.module}>
      <Image
        src={author.userThmbImgUrl ? author.userThmbImgUrl : '../../icon/person.png'}
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
