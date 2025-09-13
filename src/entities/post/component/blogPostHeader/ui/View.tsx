'use client';

import { useState } from 'react';
import css from './view.module.scss';
import { getPosts } from '@/entities/post/api';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { queryKey } from '@/app/provider/query/lib';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { PostListHashtags } from '@/entities/hashtag/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const searchParams = useSearchParams();
  const pageNum = searchParams?.get('pageNum') || '1';
  const tagId = searchParams?.get('tagId') || '';
  const tempYn = searchParams?.get('tempYn') || 'N';

  const [isTagListOpen, setIsTagListOpen] = useState(false);
  const isTempPosts = tempYn === 'Y';

  const { data: postsRes, error: postsError } = useQuery({
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: userId, tagId, tempYn }),
    queryFn: () => getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId, tempYn }),
  });

  if (postsError) {
    throw new Error('Posts fetch error');
  }

  const { data: hashtagsRes, error: hashtagsError } = useQuery({
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  });

  if (hashtagsError) {
    throw new Error('Hashtags fetch error');
  }

  const posts = postsRes?.data || [];
  const hashtags = hashtagsRes?.data || [];
  const hashtagName = posts[0]?.hashtagName ?? '';
  const totalItems = posts[0]?.totalItems ?? 0;
  const headerTitle = isTempPosts ? '임시 글' : tagId ? `'${hashtagName}' 태그의 글 목록` : '전체 글';
  const showTagList = !isTempPosts && hashtags.length > 0;

  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.postCnt}>{`${headerTitle}(${totalItems})`}</span>
        {showTagList && (
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
      {isTagListOpen && <PostListHashtags userId={userId} hashtags={hashtags} />}
    </div>
  );
};

export default View;
