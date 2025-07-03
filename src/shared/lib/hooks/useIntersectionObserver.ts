'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseIntersectionObserverProps {
  onShow: () => void;
  onHide?: () => void;
  options?: IntersectionObserverInit;
  once?: boolean;
}

interface UseIntersectionObserverReturn {
  setTarget: (element: Element | null) => void;
  isIntersecting: boolean;
}

/**
 * Intersection Observer API를 사용한 요소 가시성 감지 hook
 * @param onShow - 요소가 화면에 나타날 때 호출되는 콜백
 * @param onHide - 요소가 화면에서 사라질 때 호출되는 콜백 (선택사항)
 * @param options - IntersectionObserver 옵션 (선택사항)
 * @param once - onShow를 한 번만 호출할지 여부 (기본값: false)
 * @returns setTarget 함수와 현재 교차 상태
 */
export const useIntersectionObserver = ({
  onShow,
  onHide,
  options,
  once = false,
}: UseIntersectionObserverProps): UseIntersectionObserverReturn => {
  const [target, setTarget] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasShownRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);

        if (isCurrentlyIntersecting) {
          if (!once || !hasShownRef.current) {
            onShow();
            hasShownRef.current = true;

            if (once && target) {
              observerRef.current?.unobserve(target);
            }
          }
        } else {
          onHide?.();
        }
      });
    },
    [onShow, onHide, once, target],
  );

  useEffect(() => {
    if (!target) return;

    observerRef.current = new IntersectionObserver(handleIntersection, options ?? {});
    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [target, handleIntersection, options]);

  const setTargetElement = useCallback((element: Element | null) => {
    setTarget(element);
    if (!element) {
      hasShownRef.current = false;
      setIsIntersecting(false);
    }
  }, []);

  return {
    setTarget: setTargetElement,
    isIntersecting,
  };
};
