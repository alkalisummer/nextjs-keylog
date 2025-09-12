import { redirect } from 'next/navigation';
import { isServer } from '@/shared/lib/util';
import { getCustomSession } from '@/shared/lib/util/auth/server/action';
import { buildSearchParams, handleResponse, handleNetworkError } from './util';
import { FetchProps, HttpMethod, ApiResponse, ExtendedFetchOptions, HttpClient, HttpClientRequestProps } from './type';
import { setCookies } from '@/shared/lib/util';
import {
  applySetCookieHeader,
  fetchNextAuthCsrfToken,
  getCurrentCookieHeader,
  refreshAccessToken,
  updateNextAuthSession,
} from '@/shared/lib/util';

const BASE_URL = process.env.BASE_URL ?? '';
const KEYLOG_API_URL = process.env.NEXT_PUBLIC_KEYLOG_API_URL ?? '';

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
    isPublic = false,
    stream = false,
    withCookie = false,
  }: FetchProps): Promise<ApiResponse<T>> {
    const url = baseUrl + endpoint + buildSearchParams(searchParams);

    let bearer: string | undefined = overrideBearer;
    let cookieHeader: string | undefined;

    if (isServer()) {
      const { cookies: nextCookies, headers: nextHeaders } = await import('next/headers');
      const cookie = await nextCookies();

      cookieHeader = cookie.toString();

      // 공개 API 가 아닌 경우
      if (!isPublic) {
        const session = await getCustomSession();

        // 세션이 없는 경우 로그인 페이지로 리다이렉트
        if (!session?.accessToken) {
          const headers = await nextHeaders();
          const referer = headers.get('referer') || '/';
          redirect(`/login?reason=session_expired&redirect=${encodeURIComponent(referer)}`);
        }

        // 세션이 만료된 경우 access token 갱신 시도
        if (session?.accessTokenExpireDate && Date.now() >= session.accessTokenExpireDate) {
          cookieHeader = await (async () => {
            try {
              const cookieHeader = await getCurrentCookieHeader();
              return cookieHeader;
            } catch {
              return undefined;
            }
          })();

          try {
            // access token 갱신
            const { result, setCookieHeader: apiSetCookie } = await refreshAccessToken();
            if (isServer()) await applySetCookieHeader(apiSetCookie);

            // next auth session access token 정보 업데이트
            const csrfToken = await fetchNextAuthCsrfToken(cookieHeader);

            const { setCookieHeader: nextAuthSetCookie } = await updateNextAuthSession({
              accessToken: result.accessToken,
              accessTokenExpireDate: result.accessTokenExpireDate,
              cookieHeader,
              csrfToken,
            });
            if (isServer()) await applySetCookieHeader(nextAuthSetCookie);

            session.accessToken = result.accessToken;
            session.accessTokenExpireDate = result.accessTokenExpireDate;
          } catch {
            // 세션 만료 처리(refresh token 만료)
            const headers = await nextHeaders();
            const referer = headers.get('referer') || '/';

            // next auth signout 처리 (callbackUrl 전체 인코딩 금지, redirect 값만 인코딩)
            redirect(`/logout?callbackUrl=/login?reason=session_expired&redirect=${encodeURIComponent(referer)}`);
          }
        }
        bearer = session?.accessToken || undefined;
      }
    }

    const headers: HeadersInit = {
      Accept: stream ? 'text/plain' : 'application/json',
      ...(bearer && { Authorization: `Bearer ${bearer}` }),
      ...customHeaders,
      ...(body && { 'Content-Type': 'application/json' }),
      ...((!isPublic || withCookie) && cookieHeader ? { Cookie: cookieHeader } : {}),
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
      credentials: !isPublic || withCookie ? 'include' : 'omit',
    };

    try {
      const response = await fetch(url, requestOptions);
      // 쿠키 설정
      const { headers: responseHeaders } = response;
      const setCookieHeader = responseHeaders.get('set-cookie') || responseHeaders.get('Set-Cookie');
      if (isServer() && setCookieHeader) {
        await setCookies(setCookieHeader);
      }
      if (stream) {
        const reader = response.body?.getReader() as unknown as T;
        return {
          ok: response.ok,
          status: response.status,
          headers: response.headers,
          data: reader,
          ...(response.ok ? {} : { error: response.statusText }),
        } as ApiResponse<T>;
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
      isPublic: options?.isPublic,
      withCookie: (options as any)?.withCookie,
      stream: options?.stream,
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
