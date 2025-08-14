import { isServer } from '@/shared/lib/util';
import { getCustomSession } from '@/shared/lib/util/auth/server/action';
import { buildSearchParams, handleResponse, handleNetworkError } from './util';
import { FetchProps, HttpMethod, ApiResponse, ExtendedFetchOptions, HttpClient, HttpClientRequestProps } from './type';
import { setCookiesFromSetCookieHeader } from '@/shared/lib/util/cookie/server';

const BASE_URL = process.env.BASE_URL ?? '';
const KEYLOG_API_URL = process.env.NEXT_PUBLIC_KEYLOG_URL ?? '';

export const client = {
  route: () => createFetchInstance(`${BASE_URL}/api`),
  post: () => createFetchInstance(`${KEYLOG_API_URL}/post`),
  article: () => createFetchInstance(`${KEYLOG_API_URL}/article`),
  trend: () => createFetchInstance(`${KEYLOG_API_URL}/trend`),
  hashtag: () => createFetchInstance(`${KEYLOG_API_URL}/hashtag`),
  like: () => createFetchInstance(`${KEYLOG_API_URL}/like`),
  comment: () => createFetchInstance(`${KEYLOG_API_URL}/comment`),
  postTag: () => createFetchInstance(`${KEYLOG_API_URL}/postTag`),
  user: () => createFetchInstance(`${KEYLOG_API_URL}/user`),
};

export const createFetchInstance = (baseUrl: string = ''): HttpClient => {
  const _fetch = async function <T>({
    method,
    endpoint,
    body,
    searchParams,
    headers: customHeaders,
    bearer: overrideBearer,
  }: FetchProps): Promise<ApiResponse<T>> {
    const url = baseUrl + endpoint + buildSearchParams(searchParams);

    let bearer: string | undefined = overrideBearer;
    let cookieHeader: string | undefined;
    if (isServer()) {
      const session = await getCustomSession();
      bearer = session?.accessToken || undefined;
      try {
        const { cookies: nextCookies } = await import('next/headers');
        const cookie = await nextCookies();
        cookieHeader = cookie.toString();
      } catch (_) {
        // noop: cookies not available in this server context
      }
    }

    const headers: HeadersInit = {
      Accept: 'application/json',
      ...(bearer && { Authorization: `Bearer ${bearer}` }),
      ...customHeaders,
      ...(body && { 'Content-Type': 'application/json' }),
      ...(cookieHeader && { Cookie: cookieHeader }),
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
      credentials: 'include',
    };

    try {
      const response = await fetch(url, requestOptions);
      // 쿠키 설정
      const { headers: responseHeaders } = response;
      const setCookieHeader = responseHeaders.get('set-cookie') || responseHeaders.get('Set-Cookie');
      if (isServer() && setCookieHeader) {
        await setCookiesFromSetCookieHeader(setCookieHeader);
      }

      return handleResponse<T>(response);
    } catch (error: any) {
      return handleNetworkError(error);
    }
  };

  const request = <T>(
    method: HttpMethod,
    endpoint: string,
    options?: Partial<ExtendedFetchOptions>,
  ): Promise<ApiResponse<T>> => {
    return _fetch<T>({
      method,
      endpoint,
      headers: options?.headers ?? {},
      body: options?.body,
      searchParams: options?.searchParams,
      bearer: options?.bearer,
    });
  };

  return {
    get: <T>({ endpoint = '', options }: HttpClientRequestProps): Promise<ApiResponse<T>> => {
      return request<T>('GET', endpoint, options);
    },
    post: <T>({ endpoint = '', options }: HttpClientRequestProps): Promise<ApiResponse<T>> => {
      return request<T>('POST', endpoint, options);
    },
    put: <T>({ endpoint = '', options }: HttpClientRequestProps): Promise<ApiResponse<T>> => {
      return request<T>('PUT', endpoint, options);
    },
    delete: <T>({ endpoint = '', options }: HttpClientRequestProps): Promise<ApiResponse<T>> => {
      return request<T>('DELETE', endpoint, options);
    },
  };
};
