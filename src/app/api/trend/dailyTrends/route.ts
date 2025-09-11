import { NextRequest, NextResponse } from 'next/server';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';
import { createDailyTrends } from '@/entities/trend/lib/create';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const geo = searchParams.get('geo') || 'KR';
  const hl = searchParams.get('hl') || 'ko';

  try {
    const result = await GoogleTrendsApi.dailyTrends({ geo, hl });
    const data = createDailyTrends(result.data || []);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch daily trends' }, { status: 500 });
  }
};
