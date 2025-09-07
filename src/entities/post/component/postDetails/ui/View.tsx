'use client';

import Link from 'next/link';
import css from './view.module.scss';
import { useCheckAuth } from '@/shared/hooks';
import { getUser } from '@/entities/user/api';
import { getPost } from '@/entities/post/api';
import { formatDate } from '@/shared/lib/util';
import { usePost } from '@/features/post/hooks';
import { queryKey } from '@/app/provider/query/lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { sanitizeHtml } from '@/shared/lib/dompurify/sanitize';

interface Props {
  userId: string;
  postId: number;
}

export const View = ({ userId, postId }: Props) => {
  const { data: userRes } = useSuspenseQuery({
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  });
  const { data: postRes } = useSuspenseQuery({
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => getPost(postId),
  });

  if (!userRes?.ok) throw new Error('User fetch error');
  if (!postRes?.ok) throw new Error('Post fetch error');

  const user = userRes.data;
  const post = postRes.data;

  const isAuthorized = useCheckAuth(user.userId);
  const postHtmlCntn = sanitizeHtml(Buffer.from(post.postHtmlCntn ?? '').toString());

  const { deletePostMutation } = usePost({
    delete: {
      postQueryKey: queryKey().post().postList({ authorId: user.userId }),
      userId: user.userId,
      postId: post.postId,
    },
  });

  return (
    <div className={css.module}>
      <span className={css.postTitle}>{post.postTitle}</span>
      <div className={css.postCreated}>
        <span>{`${post.authorId} • `}</span>
        <span className={`${css.marginRight} ${css.pointer}`}>
          {formatDate({ date: post.amntDttm, seperator: '.', isExtendTime: true })}
        </span>
        {isAuthorized ? (
          <>
            |
            <Link href={`/write?postId=${post.postId}`}>
              <span className={`${css.marginRight} ${css.marginLeft}`}>수정</span>
            </Link>
            |
            <span className={`${css.marginLeft} ${css.pointer}`} onClick={() => deletePostMutation.mutate()}>
              삭제
            </span>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className={css.postContent} dangerouslySetInnerHTML={{ __html: postHtmlCntn }}></div>
    </div>
  );
};

export default View;
