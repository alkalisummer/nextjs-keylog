export const enum ERROR {
  // Network Errors (네트워크 오류)
  NETWORK = 'Network error', // 네트워크 오류
  TIMEOUT = 'Request timed out', // 요청 시간이 초과되었습니다.

  // HTTP Response Errors (HTTP 응답 오류)
  BAD_REQUEST = 'Bad request', // 잘못된 요청입니다.
  UNAUTHORIZED = 'Unauthorized access', // 인증되지 않은 접근입니다.
  FORBIDDEN = 'Forbidden access', // 접근이 금지되었습니다.
  NOT_FOUND = 'Resource not found', // 리소스를 찾을 수 없습니다.
  TOO_MANY_REQUESTS = 'Too many requests', // 요청이 너무 많습니다.
  INTERNAL_SERVER_ERROR = 'Internal server error', // 내부 서버 오류가 발생했습니다.
  SERVICE_UNAVAILABLE = 'Service unavailable', // 서비스를 사용할 수 없습니다.

  // Parsing and Validation Errors (파싱 및 검증 오류)
  PARSE_RESPONSE_BODY = 'Failed to parse response body', // 응답 본문을 파싱하는 데 실패했습니다.
  INVALID_JSON = 'Invalid JSON received', // 잘못된 JSON을 받았습니다.
  INVALID_PARAMETER = 'Invalid parameter', // 잘못된 매개변수입니다.

  // Authentication Errors (인증 오류)
  AUTHENTICATION_FAILED = 'Authentication failed', // 인증에 실패했습니다.
  TOKEN_EXPIRED = 'Authentication token expired', // 인증 토큰이 만료되었습니다.

  // Other Common Errors (기타 일반 오류)
  UNKNOWN_ERROR = 'An unknown error occurred', // 알 수 없는 오류가 발생했습니다.
  CANCELED = 'Operation canceled', // 작업이 취소되었습니다.
}
