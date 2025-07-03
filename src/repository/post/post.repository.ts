import { Post } from '@/entities/posts/model';
import { HttpClient } from '@/shared/lib/client/type';

export const postRepository = (client: HttpClient) => {
  return {
    posts: async ({ searchWord, tagId, currPageNum }: { searchWord: string; tagId: string; currPageNum: number }) => {
      return await client.get<Post[]>('', { searchParams: { searchWord, tagId, currPageNum } });
    },
  };
};
