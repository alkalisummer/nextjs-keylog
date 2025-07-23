'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { isClient } from '@/shared/lib/util';
import css from './postInteractions.module.scss';
import { useClipboard } from '@/shared/lib/hooks';
import { useLikePost } from '@/features/like/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { facebookShare, twitterShare } from '@/entities/like/lib';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faPaperclip } from '@fortawesome/free-solid-svg-icons';

interface PostInteractionsProps {
  postId: number;
  postTitle: string;
}

export const PostInteractions = ({ postId, postTitle }: PostInteractionsProps) => {
  const router = useRouter();
  const { status } = useSession();
  const { isLiked, likeCnt, like, unlike } = useLikePost(postId);
  const [url, setUrl] = useState('');

  useClipboard({ elementId: 'clipboard' });

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
