import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { keyword } = body as { keyword: string };

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
    }

    const suggestRes = await axios.get(
      `https://suggestqueries.google.com/complete/search?client=chrome-omni&q=${encodeURIComponent(
        keyword,
      )}&hl=ko&gl=KR&oe=utf-8`,
    );

    const related: string[] = Array.isArray(suggestRes.data) ? suggestRes.data[1] || [] : [];
    return NextResponse.json(related);
  } catch (error) {
    return NextResponse.json({ message: 'failed to fetch related queries' }, { status: 500 });
  }
};
