export type ApiResponse<T> =
  | {
      ok: true; // 응답 성공
      status: number;
      data: T; // 응답 성공시 반드시 존재
      statusText?: string;
      headers?: Headers;
      url?: string;
      redirected?: boolean;
      error?: string;
    }
  | {
      ok: false; // 응답 실패
      status: number;
      error: string; // 응답 실패시 반드시 존재
      statusText?: string;
      headers?: Headers;
      url?: string;
      data?: T;
      redirected?: boolean;
    };

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ArrayParam = Array<string | number | boolean>;

export type SearchParams = Record<
  string,
  | string
  | number
  | boolean
  | ArrayParam
  | Record<string, string>
  | Record<string, number>
  | Record<string, boolean>
  | undefined
>;

export interface ExtendedFetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  searchParams?: SearchParams;
}

export interface FetchProps {
  method: HttpMethod;
  endpoint: string;
  headers?: HeadersInit;
  body?: Record<string, any>;
  searchParams?: SearchParams;
}
