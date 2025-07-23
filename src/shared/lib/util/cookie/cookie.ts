'use client';

import { isServer } from '@/shared/lib/util/validate';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const clientCookies = () => {
  if (isServer()) {
    return {
      get: () => null,
      getAll: () => ({}),
      set: () => {},
      remove: () => {},
    };
  }

  const getAll = (): Record<string, string> => {
    if (isServer()) return {};
    return document.cookie.split('; ').reduce((acc, cookieStr) => {
      const [key, ...rest] = cookieStr.split('=');
      acc[key] = decodeURIComponent(rest.join('='));
      return acc;
    }, {} as Record<string, string>);
  };
  const get = (name: string): string | null => getAll()[name] || null;

  const set = (name: string, value: string, options: Partial<ResponseCookie> = {}) => {
    if (isServer()) return;
    const cookieParts = [`${name}=${encodeURIComponent(value)}`];

    if (options.expires) {
      cookieParts.push(
        `expires=${
          options.expires instanceof Date ? options.expires.toUTCString() : new Date(options.expires).toUTCString()
        }`,
      );
    }
    if (options.maxAge) cookieParts.push(`max-age=${options.maxAge}`);
    cookieParts.push(`domain=${options.domain || process.env.NEXT_PUBLIC_COOKIE_DOMAIN}`);
    cookieParts.push(`path=${options.path || '/'}`);
    if (options.secure) cookieParts.push('secure');
    if (options.sameSite) cookieParts.push(`samesite=${options.sameSite}`);

    document.cookie = cookieParts.join('; ');
  };

  const remove = (name: string, path: string = '/') => {
    set(name, '', { path, expires: new Date(0) });
  };

  return {
    get,
    getAll,
    set,
    remove,
  };
};
