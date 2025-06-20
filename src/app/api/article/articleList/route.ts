import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/entities/articles/api';

export const POST = async (req: NextRequest) => {
  const { articleKeys, articleCount } = await req.json();

  const articles = await getArticles({
    articleKeys,
    articleCount: Number(articleCount),
  });

  return NextResponse.json(articles);
};
