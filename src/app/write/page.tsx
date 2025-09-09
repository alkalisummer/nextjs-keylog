'use server';
import { Write } from './ui/Write';
import { PostForm } from '@/features/post/component';
import { getCustomSession } from '@/shared/lib/util';
import { PostAssistant } from '@/entities/trend/component';

interface PageProps {
  searchParams: Promise<{ postId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { postId } = await searchParams;

  return (
    <main>
      <Write editor={<PostForm postId={Number(postId)} />} assistant={<PostAssistant />} />
    </main>
  );
}

export const generateMetadata = async () => {
  const session = await getCustomSession();
  const url = `${process.env.BASE_URL}/write`;
  return {
    title: '글쓰기',
    themeColor: '#fff',
    icons: {
      icon: [
        {
          url: session?.user?.image ?? '/favicon.ico',
          sizes: '180x180',
        },
      ],
      apple: [
        {
          url: session?.user?.image ?? '/favicon.ico',
          sizes: '180x180',
        },
      ],
    },
    openGraph: {
      type: 'website',
      url: url,
      title: '글쓰기',
    },
    alternates: {
      canonical: url,
    },
  };
};
