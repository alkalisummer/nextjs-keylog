'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import css from './view.module.scss';
import { Comment } from '@/entities/comment/model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { getRecentComments } from '@/entities/comment/api';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const router = useRouter();

  const { data: recentCommentsRes } = useQuery({
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

export default View;
