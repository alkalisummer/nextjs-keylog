'use client';

import Image from 'next/image';
import { ImageItem } from '../../model';
import { useState, useEffect } from 'react';
import { mergeUniqueImages } from '../../lib';
import css from './postImageSearch.module.scss';
import { getImageProxyUrl } from '@/entities/post/lib';
import { useIntersectionObserver } from '@/shared/hooks';
import { getSearchImages } from '../../api/getSearchImages';
import { POST_IMAGE_SEARCH_PER_PAGE } from '@/shared/lib/constants';

interface PostImageSearchProps {
  keyword?: string;
}

export const PostImageSearch = ({ keyword = '' }: PostImageSearchProps) => {
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    setSearchKeyword(keyword);
    const searchImages = async () => {
      await goSearch(keyword);
    };
    searchImages();
  }, [keyword]);

  const { setTarget } = useIntersectionObserver({
    onShow: async () => {
      const nextPageNum = pageNum + 1;
      setPageNum(nextPageNum);
      const res = await getSearchImages({
        keyword: searchKeyword,
        pageNum: nextPageNum,
        perPage: POST_IMAGE_SEARCH_PER_PAGE,
      });
      if (!res.ok) {
        throw new Error('failed to search images');
      }
      setImages(prev => mergeUniqueImages(prev, res.data));
    },
    once: true,
  });

  const goSearch = async (keyword?: string) => {
    setImages([]);
    setPageNum(1);
    const res = await getSearchImages({
      keyword: keyword ?? searchKeyword,
      pageNum: 1,
      perPage: POST_IMAGE_SEARCH_PER_PAGE,
    });
    if (!res.ok) {
      throw new Error('failed to search images');
    }
    setImages(mergeUniqueImages([], res.data));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await goSearch(searchKeyword);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.add(css.error);
  };

  return (
    <form className={css.module} onSubmit={e => onSubmit(e)}>
      <div className={css.controls}>
        <input className={css.input} value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
        <button className={css.button} type="submit" disabled={!searchKeyword}>
          검색
        </button>
        <button
          className={css.button}
          type="button"
          onClick={() => {
            if (!selectedUrl) return;
            navigator.clipboard.writeText(getImageProxyUrl(selectedUrl));
            alert('이미지 URL이 클립보드에 복사되었습니다.');
          }}
        >
          URL 복사
        </button>
      </div>
      <div className={css.imageGridWrapper}>
        <div className={css.grid}>
          {images.map((img, idx) => (
            <div key={idx} className={css.item}>
              <div className={css.imageWrapper} ref={idx === images.length - 1 ? setTarget : null}>
                <Image
                  src={getImageProxyUrl(img.link || '')}
                  alt={img.title || '검색 이미지'}
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  onClick={() => setSelectedUrl(img.link)}
                  onError={handleImageError as any}
                  className={`${css.image} ${selectedUrl === img.link ? css.active : ''}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
