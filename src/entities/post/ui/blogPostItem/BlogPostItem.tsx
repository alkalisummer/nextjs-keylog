'use client';

import Link from 'next/link';
import { Post } from '../../model';
import css from './blogPostItem.module.scss';
import { formatDate } from '@/shared/lib/util';

interface BlogPostItemProps {
  post: Post;
  userId: string;
}

export const BlogPostItem = ({ post, userId }: BlogPostItemProps) => {
  const { postId, postTitle, postCntn, postThmbImgUrl, rgsnDttm } = post || {};

  return (
    <div className={css.postTitleContent}>
      <Link href={`/${userId}/posts/${postId}`}>
        {postThmbImgUrl ? (
          <div className={css.postThumb}>
            <div className={css.thumbContent}>
              <span className={css.postTitle}>{postTitle}</span>
              <p className={css.postContent}>{postCntn ?? '작성된 내용이 없습니다.'}</p>
              <span className={css.postCreated}>
                {formatDate({ date: rgsnDttm, seperator: '.', isExtendTime: true })}
              </span>
            </div>
            <div className={css.thumbImgDiv}>
              <img className={css.thumbImg} src={postThmbImgUrl} alt="thumbImg" />
            </div>
          </div>
        ) : (
          <div>
            <span className={css.postTitle}>{postTitle}</span>
            <p className={css.postContent}>{postCntn ?? '작성된 내용이 없습니다.'}</p>
            <span className={css.postCreated}>
              {formatDate({ date: rgsnDttm, seperator: '.', isExtendTime: true })}
            </span>
          </div>
        )}
      </Link>
    </div>
  );
};
