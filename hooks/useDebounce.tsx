import { useState, useEffect } from 'react';

export function useDebounce(value: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      // delay로 정해둔 시간안에 새로운 value가 들어오면 기존 handler의 delay 초기화
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}
