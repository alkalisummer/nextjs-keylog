import { client } from '@/shared/lib/client';
import { PostHashtags } from '../model/type';

export const getPostHashtags = async (postId: number) => {
  return await client.hashtag().get<PostHashtags[]>({
    endpoint: `/search`,
    options: {
      searchParams: {
        postId,
      },
      isPublic: true,
    },
  });
};
