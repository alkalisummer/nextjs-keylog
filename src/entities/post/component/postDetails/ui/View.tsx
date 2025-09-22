'use client';

import Link from 'next/link';
import css from './view.module.scss';
import { useCheckAuth } from '@/shared/hooks';
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
  const { data: postRes } = useSuspenseQuery({
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => getPost(postId),
  });

  const post = postRes.data;

  const isAuthorized = useCheckAuth(userId);
  const postHtmlCntn = sanitizeHtml(Buffer.from(post?.postHtmlCntn ?? '').toString());

  const { deletePostMutation } = usePost({
    delete: {
      postQueryKey: queryKey().post().postList({ authorId: userId }),
      userId: userId,
      postId: postId,
    },
  });

  return (
    <div className={css.module}>
      <span className={css.postTitle}>{post?.postTitle}</span>
      <div className={css.postCreated}>
        <span>{`${post?.authorId} • `}</span>
        <span className={`${css.marginRight} ${css.pointer}`}>
          {formatDate({ date: post?.amntDttm ?? '', seperator: '.', isExtendTime: true })}
        </span>
        {isAuthorized ? (
          <>
            |
            <Link href={`/write?postId=${post?.postId}`}>
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
