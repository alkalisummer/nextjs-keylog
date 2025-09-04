import { NextRequest, NextResponse } from 'next/server';
import { NAVER_ARTICLES_PER_PAGE } from '@/shared/lib/constants';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') ?? '';

  const clientId = process.env.X_NAVER_CLIENT_ID;
  const clientSecret = process.env.X_NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Naver Articles API credentials' }, { status: 500 });
  }

  const url = new URL('https://openapi.naver.com/v1/search/news.json');
  url.search = new URLSearchParams({
    query: keyword,
    display: NAVER_ARTICLES_PER_PAGE.toString(),
    sort: 'sim',
  }).toString();

  const naverNewsRes = await fetch(url.toString(), {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
    cache: 'no-store',
  });

  if (!naverNewsRes.ok) {
    return NextResponse.json({ error: 'Naver Articles API error' }, { status: naverNewsRes.status });
  }

  const naverNewsData = await naverNewsRes.json();
  const naverNewsArticles = naverNewsData.items ?? [];

  return NextResponse.json(naverNewsArticles);
};
