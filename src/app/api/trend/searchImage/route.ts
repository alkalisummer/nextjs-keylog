import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface NaverImageItem {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
}

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { keyword, pageNum = 1 } = body as { keyword: string; pageNum?: number };

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
    }

    const clientId = process.env.X_NAVER_CLIENT_ID;
    const clientSecret = process.env.X_NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ message: 'naver api credentials missing' }, { status: 500 });
    }

    const searchParams = {
      params: { query: keyword, display: 30, start: pageNum },
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    } as const;

    const res = await axios.get('https://openapi.naver.com/v1/search/image', searchParams);
    const items: NaverImageItem[] = res.data?.items ?? [];
    const images = items.filter(obj => obj.link.includes('naver'));
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ message: 'failed to search images' }, { status: 500 });
  }
};
