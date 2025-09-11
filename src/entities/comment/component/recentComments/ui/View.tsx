'use client';

import React from 'react';
import css from './view.module.scss';
import Link from 'next/link';
import { Comment } from '@/entities/comment/model';
import { queryKey } from '@/app/provider/query/lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRecentComments } from '@/entities/comment/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const { data: recentCommentsRes } = useSuspenseQuery({
    queryKey: queryKey().comment().recentComment(userId),
    queryFn: () => getRecentComments(userId),
  });

  if (!recentCommentsRes?.ok) {
    throw new Error('Recent comments fetch error');
  }

  const recentComments = recentCommentsRes.data;

  return (
    <div className={css.module}>
      <span className={css.title}>최근 댓글</span>
      {recentComments.map((comment: Partial<Comment>) => (
        <Link
          key={`comment_${comment.commentId}`}
          className={css.item}
          href={`/${userId}/${comment.postId}?commentId=${comment.commentId}`}
        >
          <div className={css.info}>
            <span className={css.commentContent}>
              <FontAwesomeIcon icon={faCommentDots} className={css.commentIcon} />
              {comment.commentCntn}
            </span>
            <span className={css.userName}>{comment.userNickname}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default View;
