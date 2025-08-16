'use server';

import { client } from '@/shared/lib/client';

interface UpdateProfileProps {
  nickname: string;
  blogName: string;
}

export const updateProfile = async ({ nickname, blogName }: UpdateProfileProps) => {
  return await client.user().put({
    endpoint: `/update/profile`,
    options: {
      body: {
        nickname,
        blogName,
      },
    },
  });
};
