export type ParsedCookie = {
  name: string;
  value: string;
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    domain?: string;
    path?: string;
    maxAge?: number;
    expires?: Date;
    sameSite?: 'lax' | 'strict' | 'none';
  };
};

export function parseSetCookieHeader(setCookieHeader: string): ParsedCookie[] {
  const maybeMany = setCookieHeader
    .split(/,(?=[^;]+=)/)
    .map(s => s.trim())
    .filter(Boolean);

  return maybeMany.map(cookieStr => {
    const parts = cookieStr.split(';').map(p => p.trim());
    const [nameValue, ...attrParts] = parts;
    const [name, ...valueParts] = nameValue.split('=');
    const value = valueParts.join('=');

    const options: ParsedCookie['options'] = {};
    for (const attr of attrParts) {
      const [rawKey, ...rawValParts] = attr.split('=');
      const key = rawKey?.toLowerCase();
      const rawVal = rawValParts.join('=');
      if (!key) continue;
      switch (key) {
        case 'path':
          options.path = rawVal || '/';
          break;
        case 'domain':
          options.domain = rawVal;
          break;
        case 'max-age': {
          const parsed = parseInt(rawVal, 10);
          if (!Number.isNaN(parsed)) options.maxAge = parsed;
          break;
        }
        case 'expires': {
          const date = new Date(rawVal);
          if (!Number.isNaN(date.getTime())) options.expires = date;
          break;
        }
        case 'samesite': {
          const v = rawVal?.toLowerCase();
          if (v === 'lax' || v === 'strict' || v === 'none') options.sameSite = v;
          break;
        }
        case 'secure':
          options.secure = true;
          break;
        case 'httponly':
          options.httpOnly = true;
          break;
        default: {
          if (key === 'secure') options.secure = true;
          if (key === 'httponly') options.httpOnly = true;
          break;
        }
      }
    }

    return { name, value, options };
  });
}

export async function setCookiesFromSetCookieHeader(setCookieHeader: string) {
  const parsedCookies = parseSetCookieHeader(setCookieHeader);
  if (parsedCookies.length === 0) return;
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  for (const { name, value, options } of parsedCookies) {
    cookieStore.set(name, value, options);
  }
}
