'use server';

export const Page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  return <div>PostListPage {userId}</div>;
};

export default Page;
