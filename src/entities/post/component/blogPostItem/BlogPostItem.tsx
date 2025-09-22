'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { Post } from '../../model';
import css from './blogPostItem.module.scss';
import { formatDate } from '@/shared/lib/util';
import { usePost } from '@/features/post/hooks';
import { useSearchParams } from 'next/navigation';
import { queryKey } from '@/app/provider/query/lib';
import { useScrollRestoration } from '@/shared/hooks';

interface BlogPostItemProps {
  post: Post;
  userId: string;
}

export const BlogPostItem = ({ post, userId }: BlogPostItemProps) => {
  const { postId, postTitle, postCntn, postThmbImgUrl, hashtagName, rgsnDttm } = post || {};
  const { saveScrollPos, restoreScrollPos } = useScrollRestoration({
    scrollElementId: 'article',
    extendQueryParams: true,
  });

  const searchParams = useSearchParams();
  const pageNum = searchParams?.get('pageNum');
  const isTemp = searchParams?.get('tempYn') === 'Y';

  const routeUrl = isTemp ? `/write?postId=${postId}` : `/${userId}/${postId}`;

  const { deletePostMutation } = usePost({
    delete: {
      userId: userId,
      postId: postId,
      postQueryKey: queryKey()
        .post()
        .postList({
          authorId: userId,
          ...(pageNum && { currPageNum: Number(pageNum) }),
          ...(isTemp && { tempYn: 'Y' }),
        }),
    },
  });

  useEffect(() => {
    restoreScrollPos();
  }, []);

  return (
    <div className={css.module}>
      <div className={css.postTitleContent}>
        <Link href={routeUrl} onClick={() => saveScrollPos()}>
          {postThmbImgUrl ? (
            <div className={css.postThumb}>
              <div className={css.thumbContent}>
                <span className={css.postTitle}>{postTitle}</span>
                <span className={css.postCreated}>
                  {formatDate({ date: rgsnDttm, seperator: '.', isExtendTime: true })}
                  {hashtagName && (
                    <>
                      <span className={css.separator}>{`•`}</span>
                      <span>{hashtagName}</span>
                    </>
                  )}
                </span>
                <p className={css.postContent}>{postCntn ?? '작성된 내용이 없습니다.'}</p>
              </div>
              <div className={css.thumbImgDiv}>
                <Image
                  width={160}
                  height={160}
                  className={css.thumbImg}
                  src={postThmbImgUrl}
                  quality={100}
                  alt="thumbImg"
                />
              </div>
            </div>
          ) : (
            <div className={css.thumbContent}>
              <span className={css.postTitle}>{postTitle}</span>
              <span className={css.postCreated}>
                {formatDate({ date: rgsnDttm, seperator: '.', isExtendTime: true })}
                <span>{hashtagName ? `• ${hashtagName}` : ''}</span>
              </span>
              <p className={css.postContent}>{postCntn ?? '작성된 내용이 없습니다.'}</p>
            </div>
          )}
        </Link>
      </div>
      {isTemp && (
        <div className={css.deleteBtn}>
          <span onClick={() => deletePostMutation.mutate()}>삭제</span>
        </div>
      )}
    </div>
  );
};
