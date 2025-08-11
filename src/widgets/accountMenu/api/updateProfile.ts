'use server';

import { client } from '@/shared/lib/client';

interface UpdateProfileProps {
  userId: string;
  nickname: string;
  blogName: string;
}

export const updateProfile = async ({ userId, nickname, blogName }: UpdateProfileProps) => {
  return await client.user().put({
    endpoint: `/${userId}/profile`,
    options: {
      body: {
        userId,
        nickname,
        blogName,
      },
    },
  });
};
