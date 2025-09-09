import { getUser } from '@/entities/user/api';
import { getPosts } from '@/entities/post/api';
import { AsyncBoundary } from '@/shared/boundary';
import { BoxError, BoxSkeleton } from '@/shared/ui';
import { queryKey } from '@/app/provider/query/lib';
import { QueryClient } from '@tanstack/react-query';
import { PostUserInfo } from '@/entities/user/component';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { BlogPostList, BlogPostHeader } from '@/entities/post/component';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ pageNum: string; tagId: string; tempYn: string }>;
}) {
  const [{ userId }, { pageNum = '1', tagId = '', tempYn = 'N' }] = await Promise.all([params, searchParams]);

  const posts = getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId, tempYn });
  const hashtags = getAuthorHashtags(userId);
  const user = getUser(userId);

  return (
    <>
      <AsyncBoundary pending={<BoxSkeleton height={242} />} error={<BoxError height={150} />}>
        <PostUserInfo promise={{ author: user }} userId={userId} />
      </AsyncBoundary>

      <AsyncBoundary pending={<BoxSkeleton height={30} />} error={<BoxError height={150} />}>
        <BlogPostHeader promise={{ posts, hashtags }} userId={userId} pageNum={pageNum} tagId={tagId} tempYn={tempYn} />
      </AsyncBoundary>

      <AsyncBoundary pending={<BoxSkeleton height={500} />} error={<BoxError height={150} />}>
        <BlogPostList promise={{ posts }} userId={userId} pageNum={pageNum} tagId={tagId} tempYn={tempYn} />
      </AsyncBoundary>
    </>
  );
}

export const generateMetadata = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  const queryClient = new QueryClient();
  const url = `${process.env.BASE_URL}/${userId}`;

  const userRes = await queryClient.ensureQueryData({
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  });

  if (userRes.data) {
    const userInfo = userRes.data;
    return {
      title: `${userInfo.userNickname} - ${userInfo.userBlogName}`,
      description: userInfo.userBlogName,
      icons: {
        icon: [
          {
            url: userInfo.userThmbImgUrl || '/favicon.ico',
            sizes: '180x180',
          },
        ],
        apple: [
          {
            url: '/favicon.ico',
            sizes: '180x180',
          },
        ],
      },
      openGraph: {
        type: 'website',
        url: url,
        title: `${userInfo.userNickname} - ${userInfo.userBlogName}`,
        description: userInfo.userBlogName,
        images: [
          {
            url: userInfo.userThmbImgUrl || '/icon/person.png',
            width: 250,
            height: 250,
            alt: userInfo.userNickname,
          },
        ],
      },
      alternates: {
        canonical: url,
      },
    };
  }
};
