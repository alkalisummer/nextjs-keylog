import { RecentPost } from '../model';
import { client } from '@/shared/lib/client';

export const getRecentPosts = async (authorId: string) => {
  return await client.post().get<RecentPost[]>({
    endpoint: `/recent/${authorId}`,
    options: {
      isPublic: true,
    },
  });
};
