'use client';

import { useState } from 'react';
import css from './write.module.scss';
import { PostEditor } from '@/features/post/ui';

export const Write = () => {
  const [imgFiles, setImgFiles] = useState<string[]>([]);

  return (
    <div className={css.module}>
      <PostEditor setImgFiles={setImgFiles} />
      <div className={css.trendKeywords}></div>
    </div>
  );
};

export default Write;
