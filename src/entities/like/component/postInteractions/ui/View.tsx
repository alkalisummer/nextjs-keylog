'use client';

import css from './view.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { isClient } from '@/shared/lib/util';
import { useClipboard } from '@/shared/hooks';
import { useLikePost } from '@/features/like/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { facebookShare, twitterShare } from '@/entities/like/lib';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { getPost } from '@/entities/post/api';

interface Props {
  postId: number;
  authorId: string;
}

export const View = ({ postId, authorId }: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const { isLiked, likeCnt, like, unlike } = useLikePost({ postId, authorId });
  const [url, setUrl] = useState('');

  useClipboard({ elementId: 'clipboard' });

  const { data: postRes, error } = useSuspenseQuery({
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => getPost(postId),
  });

  if (error) throw new Error('Post fetch error');

  const post = postRes.data;
  const postTitle = post?.postTitle || '';

  useEffect(() => {
    if (isClient()) {
      setUrl(window.location.href);
    }
  }, []);

  const loginCheck = () => {
    if (status === 'authenticated') {
      return true;
    } else {
      alert('로그인 후 이용해주세요.');
      router.push(`/login?redirect=${window.location.href}`);
      return false;
    }
  };

  return (
    <div className={css.module}>
      <div
        className={`${css.scrapIco} ${css.likeButton}`}
        onClick={() => loginCheck() && (isLiked ? unlike() : like())}
      >
        {isLiked ? (
          <FontAwesomeIcon icon={faHeartSolid} className={css.icon} />
        ) : (
          <FontAwesomeIcon icon={faHeartRegular} className={css.icon} />
        )}
        <span className={css.likeCnt}>{likeCnt}</span>
      </div>
      <div className={css.scrapIco} onClick={() => facebookShare(url)}>
        <FontAwesomeIcon icon={faFacebookF} className={css.icon} />
      </div>
      <div className={css.scrapIco} onClick={() => twitterShare(url, postTitle)}>
        <FontAwesomeIcon icon={faTwitter} className={css.icon} />
      </div>
      <div id="clipboard" data-clipboard-text={url} className={css.scrapIco}>
        <FontAwesomeIcon icon={faPaperclip} className={css.icon} />
      </div>
    </div>
  );
};
