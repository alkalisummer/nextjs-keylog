'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import css from './recentComments.module.scss';
import { Comment } from '@/entities/comment/model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

interface RecentCommentsProps {
  recentComments: Partial<Comment>[];
  userId: string;
}

export const RecentComments = ({ recentComments, userId }: RecentCommentsProps) => {
  const router = useRouter();

  return (
    <div className={css.module}>
      <span className={css.title}>최근 댓글</span>
      {recentComments.map((comment: Partial<Comment>) => (
        <div
          key={`comment_${comment.commentId}`}
          className={css.item}
          onClick={() => router.push(`/${userId}/${comment.postId}`)}
        >
          <div className={css.info}>
            <span className={css.commentContent}>
              <FontAwesomeIcon icon={faCommentDots} className={css.commentIcon} />
              {comment.commentCntn}
            </span>
            <span className={css.userName}>{comment.userNickname}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
