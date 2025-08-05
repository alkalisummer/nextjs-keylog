'use client';

import { useState } from 'react';
import { Post } from '@/entities/post/model';
import css from './blogPostHeader.module.scss';
import { useSearchParams } from 'next/navigation';
import { HashtagInfo } from '@/entities/hashtag/model';
import { PostListHashtags } from '@/entities/hashtag/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

interface BlogPostHeaderProps {
  posts: Post[];
  hashtags: HashtagInfo[];
  userId: string;
}

export const BlogPostHeader = ({ posts, hashtags, userId }: BlogPostHeaderProps) => {
  const [isTagListOpen, setIsTagListOpen] = useState(false);

  const searchParms = useSearchParams();
  const isTempPosts = searchParms?.get('tempYn');
  const tagId = searchParms?.get('tagId');

  const hashtagName = posts[0]?.hashtagName ?? '';
  const totalItems = posts[0]?.totalItems ?? 0;

  const headerTitle = isTempPosts ? '임시 글' : tagId ? `'${hashtagName}' 태그의 글 목록` : '전체 글';

  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.postCnt}>{`${headerTitle}(${totalItems})`}</span>
        {!isTempPosts && (
          <span className={css.tagListBtn} onClick={() => setIsTagListOpen(!isTagListOpen)}>
            태그 목록 &nbsp;
            {isTagListOpen ? (
              <FontAwesomeIcon className={css.icon} icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon className={css.icon} icon={faCaretDown} />
            )}
          </span>
        )}
      </div>
      {isTagListOpen && <PostListHashtags hashtags={hashtags} userId={userId} />}
    </div>
  );
};
