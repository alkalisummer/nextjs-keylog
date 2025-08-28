import { NextRequest, NextResponse } from 'next/server';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { keyword, geo = 'KR' } = body as { keyword: string; geo?: string };

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
    }

    const interestRes = await GoogleTrendsApi.interestOverTime({ keyword, geo });
    return NextResponse.json(interestRes?.data ?? null);
  } catch (error) {
    return NextResponse.json({ message: 'failed to fetch interest over time' }, { status: 500 });
  }
};
