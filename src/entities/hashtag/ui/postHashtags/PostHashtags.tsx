'use client';

import { useRouter } from 'next/navigation';
import css from './postHashtags.module.scss';
import { PostHashtags as hashtags } from '@/entities/hashtag/model';

interface PostHashtagsProps {
  hashtags: hashtags[];
}

export const PostHashtags = ({ hashtags }: PostHashtagsProps) => {
  const router = useRouter();

  return (
    <div className={css.module}>
      {hashtags.length > 0 &&
        hashtags.map(tag => (
          <span
            className={css.hashtag}
            key={tag.hashtagId}
            onClick={() => router.push(`/home?tab=post&tagId=${tag.hashtagId}&tagName=${tag.hashtagName}`)}
          >
            {`# ${tag.hashtagName}`}
          </span>
        ))}
    </div>
  );
};
