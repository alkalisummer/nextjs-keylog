'use client';

import css from './write.module.scss';
import { PostEditor } from '@/features/post/ui';

export const Write = () => {
  return (
    <div className={css.module}>
      <PostEditor />
    </div>
  );
};
