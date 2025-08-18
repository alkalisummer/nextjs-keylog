'use server';

import { client } from '@/shared/lib/client';

export const deletePostByUserId = async () => {
  return await client.post().delete({ endpoint: `/delete/user` });
};
