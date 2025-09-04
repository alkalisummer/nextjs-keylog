import { NextRequest, NextResponse } from 'next/server';
import { getArticlesServer } from '@/entities/article/api';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { articleKeys, articleCount } = body;

  const articles = await getArticlesServer({
    articleKeys,
    articleCount,
  });

  return NextResponse.json(articles);
};
