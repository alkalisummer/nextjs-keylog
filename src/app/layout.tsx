import '@/styles/globals.css';
import { spoqa, figtree, firaMono } from '@/styles/fonts/fonts';
import { Viewport } from 'next';
import { Scaffold } from '@/shared/ui/layout';
import { getCustomSession } from '@/shared/lib/util';
import { QueryProvider, SessionProvider } from './provider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomSession();

  return (
    <html lang="kr" className={`${spoqa.variable} ${figtree.variable} ${firaMono.variable}`}>
      <body>
        <QueryProvider>
          <SessionProvider session={session}>
            <Scaffold>{children}</Scaffold>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

export const generateMetadata = async () => {
  const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: 'Keylog',
    description: '인기 키워드를 활용한 블로그 포스팅',
    icons: {
      icon: [
        {
          url: '/favicon.ico',
          sizes: '180x180',
        },
      ],
    },
    openGraph: {
      type: 'website',
      url: `${process.env.BASE_URL}`,
      images: [
        {
          url: '/logo.png',
          width: 650,
          height: 250,
          alt: 'Keylog',
        },
      ],
      title: 'Keylog',
      description: '인기 키워드를 활용한 블로그 포스팅',
    },
    alternates: {
      canonical: `${process.env.BASE_URL}`,
    },
  };
};

export const viewport: Viewport = {
  themeColor: '#fff',
};
