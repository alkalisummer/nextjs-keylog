'use client';

import Link from 'next/link';
import css from './postDetail.module.scss';
import { User } from '@/entities/user/model';
import { formatDate } from '@/shared/lib/util';
import { useCheckAuth } from '@/shared/lib/hooks';
import { PostDetail } from '@/entities/post/model';
import { queryKey } from '@/app/provider/query/lib';
import { parseImgfileArr } from '@/entities/post/lib';
import { useDeletePost } from '@/features/post/delete/hook';

interface PostDetailProps {
  post: PostDetail;
  user: User;
}

export const PostDetails = ({ post, user }: PostDetailProps) => {
  const isAuthorized = useCheckAuth(user.userId);
  const postHtmlCntn = Buffer.from(post.postHtmlCntn).toString();
  const imgFiles = parseImgfileArr(postHtmlCntn);

  const { deletePostMutation } = useDeletePost({
    postQueryKey: queryKey().post().postList({ authorId: user.userId }),
    userId: user.userId,
  });

  return (
    <div className="post_title_created">
      <span className="post_title">{post.postTitle}</span>
      <div className="post_created">
        <span className="mg-r-10 pointer">
          {formatDate({ date: post.amntDttm, seperator: '.', isExtendTime: true })}
        </span>
        {isAuthorized ? (
          <>
            |
            <Link href={`/write?postId=${post.postId}`}>
              <span className="mg-r-10 mg-l-10">수정</span>
            </Link>
            |
            <span className="mg-l-10 pointer" onClick={() => deletePostMutation(post.postId)}>
              삭제
            </span>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
