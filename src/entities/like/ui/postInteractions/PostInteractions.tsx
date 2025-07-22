'use client';

import { useEffect, useState } from 'react';
import css from './postInteractions.module.scss';
import { useClipboard } from '@/shared/lib/hooks';
import { useLikePost } from '@/features/like/hooks';
import { facebookShare, twitterShare } from '@/entities/like/lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faPaperclip } from '@fortawesome/free-solid-svg-icons';

interface PostInteractionsProps {
  postId: number;
  postTitle: string;
}

export const PostInteractions = ({ postId, postTitle }: PostInteractionsProps) => {
  const { isLiked, likeCnt, like, unlike } = useLikePost(postId);
  const [url, setUrl] = useState('');

  useClipboard({ elementId: 'clipboard' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <div className={css.module}>
      <div className={`${css.scrapIco} ${css.likeButton}`} onClick={() => (isLiked ? unlike() : like())}>
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
