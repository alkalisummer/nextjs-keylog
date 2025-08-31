import { NextRequest, NextResponse } from 'next/server';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { keyword, geo = 'KR' } = body as { keyword: string; geo?: string };

  if (!keyword || typeof keyword !== 'string') {
    return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
  }

  const interestRes = await GoogleTrendsApi.interestOverTime({ keyword, geo });
  return NextResponse.json(interestRes?.data ?? null);
};
