'use client';

import Link from 'next/link';
import Image from 'next/image';
import css from './commentHeader.module.scss';

interface CommentHeaderProps {
  authorId: string;
  userImageUrl?: string | null;
  userNickname: string;
  date: string;
  canShowActions: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function CommentHeader({
  authorId,
  userImageUrl,
  userNickname,
  date,
  canShowActions,
  onEditClick,
  onDeleteClick,
}: CommentHeaderProps) {
  return (
    <div className={css.module}>
      <div className={css.userInfo}>
        <Image
          className={css.userImage}
          width={54}
          height={54}
          quality={100}
          priority={true}
          src={userImageUrl || '/icon/person.png'}
          alt={`${userNickname} profile`}
        />
        <div className={css.userDetails}>
          <Link href={`/${authorId}`}>
            <span className={css.userName}>{userNickname}</span>
          </Link>
          <span className={css.date}>{date}</span>
        </div>
      </div>
      {canShowActions && (
        <div className={css.actions}>
          <span className={css.actionText} onClick={onEditClick}>
            수정
          </span>
          <span className={css.actionText} onClick={onDeleteClick}>
            삭제
          </span>
        </div>
      )}
    </div>
  );
}
