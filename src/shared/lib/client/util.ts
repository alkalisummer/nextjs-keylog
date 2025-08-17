import { ApiResponse, SearchParams } from './type';
import { ERROR } from '../constants/error/error.constant';

export const buildSearchParams = (params: SearchParams | undefined): string => {
  if (!params) return '';
  const searchParams = Object.entries(params)
    .map(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        return value.map(x => `${encodeURIComponent(key)}=${encodeURIComponent(x)}`).join('&');
      }
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
          .map(([k, v]) => `${encodeURIComponent(key)}=${encodeURIComponent(k)}:${encodeURIComponent(v)}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');

  return searchParams ? `?${searchParams}` : '';
};

export const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (response.ok) {
      return createResponse<T>({
        ok: true,
        status: response.status,
        headers: response.headers,
        data,
      });
    } else {
      return createResponse<T>({
        ok: false,
        status: response.status,
        error: response.statusText,
        ...(data && { data }),
      });
    }
  } catch (err) {
    return {
      ok: false,
      status: response.status,
      error: ERROR.PARSE_RESPONSE_BODY,
    };
  }
};

export const handleNetworkError = async <T>(error: Error): Promise<ApiResponse<T>> => {
  return createResponse<never>({
    ok: false,
    status: 500,
    error: error.message || ERROR.NETWORK,
  });
};

export const createResponse = <T>(response: ApiResponse<T>) => {
  return { ...response };
};
