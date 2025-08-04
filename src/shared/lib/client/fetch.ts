import { FetchProps, HttpMethod, ApiResponse, ExtendedFetchOptions, HttpClient, HttpClientRequestProps } from './type';
import { buildSearchParams, handleResponse, handleNetworkError } from './util';

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
  }: FetchProps): Promise<ApiResponse<T>> {
    const url = baseUrl + endpoint + buildSearchParams(searchParams);

    const headers: HeadersInit = {
      Accept: 'application/json',
      ...customHeaders,
      ...(body && { 'Content-Type': 'application/json' }),
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    try {
      const response = await fetch(url, requestOptions);
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
