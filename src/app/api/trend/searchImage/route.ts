import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface NaverImageItem {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
}

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { keyword, pageNum = 1, perPage = 10 } = body as { keyword: string; pageNum?: number; perPage?: number };

  if (!keyword || typeof keyword !== 'string') {
    return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
  }

  const clientId = process.env.X_NAVER_CLIENT_ID;
  const clientSecret = process.env.X_NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ message: 'naver api credentials missing' }, { status: 500 });
  }

  const searchParams = {
    params: { query: keyword, display: perPage, start: pageNum },
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  };

  const res = await axios.get('https://openapi.naver.com/v1/search/image', searchParams);
  const items: NaverImageItem[] = res.data?.items ?? [];

  return NextResponse.json(items);
};
