'use client';

import Image from 'next/image';
import css from './commentHeader.module.scss';

type CommentHeaderProps = {
  userImageUrl?: string | null;
  userNickname: string;
  date: string;
  canShowActions: boolean;
  onUserClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export function CommentHeader({
  userImageUrl,
  userNickname,
  date,
  canShowActions,
  onUserClick,
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
          <span className={css.userName} onClick={onUserClick}>
            {userNickname}
          </span>
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
