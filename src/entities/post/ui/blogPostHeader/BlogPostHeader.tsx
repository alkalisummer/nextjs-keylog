'use client';

import { useState } from 'react';
import css from './blogPostHeader.module.scss';
import { getPosts } from '@/entities/post/api';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { queryKey } from '@/app/provider/query/lib';
import { HashtagInfo } from '@/entities/hashtag/model';
import { PostListHashtags } from '@/entities/hashtag/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

interface BlogPostHeaderProps {
  hashtags: HashtagInfo[];
  userId: string;
}

export const BlogPostHeader = ({ hashtags, userId }: BlogPostHeaderProps) => {
  const [isTagListOpen, setIsTagListOpen] = useState(false);

  const searchParms = useSearchParams();
  const tagId = searchParms?.get('tagId') ?? '';
  const pageNum = searchParms?.get('pageNum') || '1';
  const tempYn = searchParms?.get('tempYn') || 'N';
  const isTempPosts = tempYn === 'Y';

  const { data: postsRes } = useQuery({
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId, tempYn: tempYn }),
    queryFn: () => getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId, tempYn: tempYn }),
  });

  const posts = postsRes?.data || [];

  const hashtagName = posts[0]?.hashtagName;
  const totalItems = posts[0]?.totalItems;

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
