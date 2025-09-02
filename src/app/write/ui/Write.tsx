'use client';

import { useState } from 'react';
import css from './write.module.scss';
import { PostForm } from '@/features/post/ui';
import { Trend } from '@/entities/trend/model';
import { useQuery } from '@tanstack/react-query';
import { PostDetail } from '@/entities/post/model';
import { PostAssistant } from '@/entities/trend/ui';
import { queryKey } from '@/app/provider/query/lib';
import { getPostHashtags } from '@/entities/hashtag/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';

interface WriteProps {
  post?: PostDetail;
  trends: Trend[];
  authorId: string;
}

export const Write = ({ post, trends, authorId }: WriteProps) => {
  const postId = post?.postId;
  const [showAssistant, setShowAssistant] = useState(true);

  const { data: hashtagsRes } = useQuery({
    queryKey: queryKey().hashtag().postHashtags(Number(postId)),
    queryFn: () => getPostHashtags(Number(postId)),
    enabled: !!postId,
  });

  const hashtags = hashtagsRes?.data?.map(tag => tag.hashtagName) || [];

  return (
    <div className={css.module}>
      <div className={css.editorSection}>
        <PostForm post={post} hashtags={hashtags} authorId={authorId} />
      </div>
      <div className={css.postAssistantToggle}>
        <button
          className={`${css.postAssistantToggleBtn} ${showAssistant ? css.rotated : ''}`}
          onClick={() => setShowAssistant(!showAssistant)}
        >
          <FontAwesomeIcon icon={faAngleLeft} className={css.toggleIcon} />
        </button>
      </div>
      <div className={css.postAssistantMobileToggle}>
        <button
          className={`${css.postAssistantMobileToggleBtn} ${showAssistant ? css.rotated : ''}`}
          onClick={() => setShowAssistant(!showAssistant)}
        >
          <FontAwesomeIcon icon={faAngleDown} className={css.toggleIcon} />
        </button>
      </div>
      <div className={`${css.postAssistant} ${!showAssistant ? css.isClosed : ''}`}>
        <PostAssistant trends={trends} />
      </div>
    </div>
  );
};

export default Write;
