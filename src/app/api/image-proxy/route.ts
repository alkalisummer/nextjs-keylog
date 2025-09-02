import { isPrivateHostname } from './lib';

export const runtime = 'edge';

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');
  if (!target) {
    return new Response('Missing url', { status: 400 });
  }

  const parsed = new URL(target);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return new Response('Invalid protocol', { status: 400 });
  }
  if (isPrivateHostname(parsed.hostname)) {
    return new Response('Forbidden host', { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; KeylogBot/1.0; +https://keylog.hopto.org)' },
    // Cache on the edge for 1 day
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!upstream.ok) {
    return new Response('Upstream error', { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    return new Response('Unsupported media type', { status: 415 });
  }

  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=2592000');

  return new Response(upstream.body, { headers });
}
