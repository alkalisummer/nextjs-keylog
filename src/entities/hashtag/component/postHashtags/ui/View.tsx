'use client';

import Link from 'next/link';
import css from './view.module.scss';
import { queryKey } from '@/app/provider/query/lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getPostHashtags } from '@/entities/hashtag/api';

interface Props {
  postId: number;
}

export const View = ({ postId }: Props) => {
  const { data: hashtagsRes } = useSuspenseQuery({
    queryKey: queryKey().hashtag().postHashtags(postId),
    queryFn: () => getPostHashtags(postId),
  });

  if (!hashtagsRes?.ok) {
    throw new Error('Hashtags fetch error');
  }

  const hashtags = hashtagsRes.data;

  return (
    <div className={css.module}>
      {hashtags.length > 0 &&
        hashtags.map(tag => (
          <Link
            className={css.hashtag}
            key={tag.hashtagId}
            href={`/home?tab=post&tagId=${tag.hashtagId}&tagName=${tag.hashtagName}`}
          >
            {`# ${tag.hashtagName}`}
          </Link>
        ))}
    </div>
  );
};

export default View;
