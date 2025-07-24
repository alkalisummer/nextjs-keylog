'use client';

import React from 'react';
import Link from 'next/link';
import css from './userInfo.module.scss';
import { User } from '@/entities/user/model';
import { useCheckAuth } from '@/shared/lib/hooks';

interface UserInfoProps {
  userInfo: User;
}

export const UserInfo = ({ userInfo }: UserInfoProps) => {
  const userId = userInfo.userId;
  const isAuthorized = useCheckAuth(userId);

  return (
    <div className={css.module}>
      <Link href={`/${userId}`}>
        <img
          src={userInfo.userThmbImgUrl ? userInfo.userThmbImgUrl : '/../../icon/person.png'}
          className={css.profileIcon}
          alt="profile img"
        />
      </Link>
      <Link href={`/${userId}`} className={css.blogName}>
        <span>{userInfo.userBlogName}</span>
      </Link>
      <span className={css.nickname}>{userInfo.userNickname}</span>
      {isAuthorized && (
        <div className={css.btnDiv}>
          <Link href={`/write?keyword=true`}>
            <button className={css.createBtn}></button>
          </Link>
        </div>
      )}
    </div>
  );
};
