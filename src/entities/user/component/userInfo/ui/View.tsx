'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import css from './view.module.scss';
import { useCheckAuth } from '@/shared/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { getUser } from '@/entities/user/api';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const isAuthorized = useCheckAuth(userId);

  const { data: userInfoRes } = useQuery({
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  });

  if (!userInfoRes?.ok) {
    throw new Error('User fetch error');
  }

  const userInfo = userInfoRes.data;

  return (
    <div className={css.module}>
      <Link href={`/${userId}`}>
        <Image
          src={userInfo.userThmbImgUrl ? userInfo.userThmbImgUrl : '/icon/person.png'}
          className={css.profileIcon}
          alt="profile img"
          width={60}
          height={60}
          quality={100}
          priority
        />
      </Link>
      <Link href={`/${userId}`} className={css.blogName}>
        <span>{userInfo.userBlogName}</span>
      </Link>
      <span className={css.nickname}>{userInfo.userNickname}</span>
      {isAuthorized && (
        <div className={css.btnDiv}>
          <Link href={`/write`}>
            <button className={css.createBtn}></button>
          </Link>
        </div>
      )}
    </div>
  );
};
