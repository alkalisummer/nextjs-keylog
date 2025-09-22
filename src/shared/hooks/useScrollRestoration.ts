'use client';

import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface Props {
  scrollElementId: string;
  extendQueryParams?: boolean;
}

export const useScrollRestoration = ({ scrollElementId, extendQueryParams = false }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const key = createScrollKey(pathname, query, extendQueryParams);

  const saveScrollPos = () => saveScrollPosImpl(scrollElementId, key);
  const restoreScrollPos = () => restoreScrollPosImpl(scrollElementId, key);

  return {
    saveScrollPos,
    restoreScrollPos,
  };
};

const createScrollKey = (pathname: string, query: string, extendQueryParams?: boolean) => {
  return `scrollPos_${pathname}${extendQueryParams && query ? `_${query}` : ''}`;
};

const saveScrollPosImpl = (scrollElementId: string, key: string) => {
  const el = document.getElementById(scrollElementId);
  if (!el) return;
  sessionStorage.setItem(key, el.scrollTop.toString());
};

const restoreScrollPosImpl = (scrollElementId: string, key: string) => {
  const el = document.getElementById(scrollElementId);
  const scrollTop = sessionStorage.getItem(key);
  if (!el || !scrollTop) return;
  requestAnimationFrame(() => {
    el.scrollTop = parseInt(scrollTop, 10);
  });
  sessionStorage.removeItem(key);
};
