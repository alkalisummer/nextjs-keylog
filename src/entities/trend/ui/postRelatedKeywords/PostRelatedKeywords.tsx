'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import css from './postRelatedKeywords.module.scss';
import { getRelatedQueries } from '../../api';

interface PostRelatedKeywordsProps {
  keyword?: string;
}

export function PostRelatedKeywords({ keyword }: PostRelatedKeywordsProps) {
  const [related, setRelated] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;
    const fetchRelated = async () => {
      if (!keyword) {
        setRelated([]);
        return;
      }
      const result = await getRelatedQueries(keyword);
      if (!ignore) setRelated(result || []);
    };
    fetchRelated();
    return () => {
      ignore = true;
    };
  }, [keyword]);

  if (!keyword) return null;

  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.title}>연관 검색어</span>
        <span className={css.keyword}>{keyword}</span>
      </div>
      <div className={css.tags}>
        {related.map((text, idx) => (
          <Link key={`${text}-${idx}`} href={`https://www.google.com/search?q=${text}`} target="_blank">
            <span className={css.tag}>{text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
