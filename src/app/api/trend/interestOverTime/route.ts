import { NextRequest, NextResponse } from 'next/server';
import GoogleTrendsApi, { GoogleTrendsTimeOptions } from '@alkalisummer/google-trends-js';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword')?.split(',');
  const geo = searchParams.get('geo') || 'KR';
  const hl = searchParams.get('hl') || 'ko';
  const period = (searchParams.get('period') as GoogleTrendsTimeOptions) || 'now 1-d';

  if (!keyword || !Array.isArray(keyword)) {
    return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
  }

  const interestRes = await GoogleTrendsApi.interestOverTime({ keyword, geo, hl, period });
  return NextResponse.json(interestRes?.data ?? null);
};
