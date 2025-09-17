import { NextRequest, NextResponse } from 'next/server';
import { NAVER_BLOG_POSTS_PER_PAGE } from '@/shared/lib/constants';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') ?? '';

  const clientId = process.env.X_NAVER_CLIENT_ID;
  const clientSecret = process.env.X_NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Naver Blog Posts API credentials' }, { status: 500 });
  }

  const url = new URL('https://openapi.naver.com/v1/search/blog.json');
  url.search = new URLSearchParams({
    query: keyword,
    display: NAVER_BLOG_POSTS_PER_PAGE.toString(),
  }).toString();

  const naverBlogPostsRes = await fetch(url.toString(), {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  });

  if (!naverBlogPostsRes.ok) {
    return NextResponse.json({ error: 'Naver Blog Posts API error' }, { status: naverBlogPostsRes.status });
  }

  const naverBlogPostsData = await naverBlogPostsRes.json();
  const naverBlogPosts = naverBlogPostsData.items ?? [];

  return NextResponse.json(naverBlogPosts);
};
