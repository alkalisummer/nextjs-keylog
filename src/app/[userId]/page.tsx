'use server';

import { getUser } from '@/entities/user/api';
import { getPosts } from '@/entities/post/api';
import { PostUserInfo } from '@/entities/user/component';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { BlogPostList, BlogPostHeader } from '@/entities/post/component';

export const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ pageNum: string; tagId: string; tempYn: string }>;
}) => {
  const [{ userId }, { pageNum = '1', tagId = '', tempYn = 'N' }] = await Promise.all([params, searchParams]);

  const posts = getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId, tempYn });
  const hashtags = getAuthorHashtags(userId);
  const user = getUser(userId);

  return (
    <>
      <PostUserInfo promise={{ author: user }} userId={userId} />
      <BlogPostHeader promise={{ posts, hashtags }} userId={userId} pageNum={pageNum} tagId={tagId} tempYn={tempYn} />
      <BlogPostList promise={{ posts }} userId={userId} pageNum={pageNum} tagId={tagId} tempYn={tempYn} />
    </>
  );
};

export default Page;
