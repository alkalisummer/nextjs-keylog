'use server';
import { Write } from './ui/Write';
import { PostForm } from '@/features/post/component';
import { PostAssistant } from '@/entities/trend/component';

interface PageProps {
  searchParams: Promise<{ postId?: string }>;
}

export const Page = async ({ searchParams }: PageProps) => {
  const { postId } = await searchParams;

  return (
    <main>
      <Write editor={<PostForm postId={Number(postId)} />} assistant={<PostAssistant />} />
    </main>
  );
};

export default Page;
