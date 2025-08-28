'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import css from './postImageSearch.module.scss';
import { searchImages, ImageItem } from '../../api/searchImageClient';
import { useIntersectionObserver } from '@/shared/lib/hooks';

interface PostImageSearchProps {
  defaultKeyword?: string;
}

export function PostImageSearch({ defaultKeyword = '' }: PostImageSearchProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: () => !loading && images.length && setPageNum(p => p + 1),
  });

  useEffect(() => {
    setImages([]);
    setPageNum(1);
  }, [keyword]);

  useEffect(() => {
    let ignore = false;
    const fetch = async () => {
      if (!keyword) return;
      setLoading(true);
      const res = await searchImages(keyword, pageNum);
      if (!ignore) setImages(prev => [...prev, ...(res || [])]);
      setLoading(false);
    };
    fetch();
    return () => {
      ignore = true;
    };
  }, [keyword, pageNum]);

  const handleSearch = () => {
    if (!keyword) return;
    setImages([]);
    setPageNum(1);
  };

  const normalizeUrl = (url: string) => url.replace(/^http:\/\//i, 'https://');

  return (
    <div className={css.module}>
      <div className={css.controls}>
        <label className={css.label}>키워드:</label>
        <input className={css.input} value={keyword} onChange={e => setKeyword(e.target.value)} />
        <button className={css.button} onClick={handleSearch} disabled={!keyword}>
          이미지 검색
        </button>
        <button className={css.button} onClick={() => setSelectedUrl('')}>
          초기화
        </button>
        <button
          className={css.button}
          onClick={() => {
            if (!selectedUrl) return;
            navigator.clipboard.writeText(selectedUrl);
          }}
        >
          이미지 URL 복사
        </button>
      </div>

      <div className={css.grid}>
        {images.map((img, idx) => (
          <div key={idx} className={css.item}>
            <Image
              src={normalizeUrl(img.link)}
              width={200}
              height={200}
              alt={img.title || '검색 이미지'}
              onClick={e => setSelectedUrl((e.target as HTMLImageElement).src)}
              className={`${css.image} ${selectedUrl === img.link ? css.active : ''}`}
            />
          </div>
        ))}
        <div ref={loadMoreRef} />
      </div>
      {loading && <div className={css.loading}>Loading...</div>}
    </div>
  );
}
