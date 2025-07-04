import { FetchProps, HttpMethod, ApiResponse, ExtendedFetchOptions } from './type';
import { buildSearchParams, handleResponse, handleNetworkError } from './util';

const _fetch = async function <T>({
  method,
  endpoint,
  body,
  searchParams,
  headers: header,
}: FetchProps): Promise<ApiResponse<T>> {
  const url = process.env.KEYLOG_API_URL + endpoint + buildSearchParams(searchParams);

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...header,
    },
    ...(body && { body: JSON.stringify(body) }),
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

export const client = {
  get: <T>(endpoint: string, options?: Partial<ExtendedFetchOptions>): Promise<ApiResponse<T>> => {
    return request<T>('GET', endpoint, options);
  },
  post: <T>(endpoint: string, options?: Partial<ExtendedFetchOptions>): Promise<ApiResponse<T>> => {
    return request<T>('POST', endpoint, options);
  },
  put: <T>(endpoint: string, options?: Partial<ExtendedFetchOptions>): Promise<ApiResponse<T>> => {
    return request<T>('PUT', endpoint, options);
  },
  delete: <T>(endpoint: string, options?: Partial<ExtendedFetchOptions>): Promise<ApiResponse<T>> => {
    return request<T>('DELETE', endpoint, options);
  },
};
