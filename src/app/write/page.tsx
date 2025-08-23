'use server';

import { PostEditor } from '@/features/post/ui';

export const Page = async () => {
  return (
    <main>
      <PostEditor />
    </main>
  );
};

export default Page;
