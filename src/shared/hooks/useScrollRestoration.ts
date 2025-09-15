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
  const path = createScrollKey({ pathname, query, extendQueryParams });

  const saveScrollPos = () => {
    const el = document.getElementById(scrollElementId);

    if (!el) return;
    sessionStorage.clear();
    sessionStorage.setItem(path, el.scrollTop.toString());
  };

  const restoreScrollPos = (searchParams?: string) => {
    const el = document.getElementById(scrollElementId);
    const scrollKey = `${path}${searchParams ? `_${searchParams}` : ''}`;
    const scrollTop = sessionStorage.getItem(scrollKey);

    if (!el || !scrollTop) return;

    el.scrollTo({
      top: parseInt(scrollTop),
      behavior: 'smooth',
    });
    sessionStorage.removeItem(scrollKey);
  };

  return {
    saveScrollPos,
    restoreScrollPos,
  };
};

const createScrollKey = ({
  pathname,
  query,
  extendQueryParams,
}: {
  pathname: string;
  query: string;
  extendQueryParams?: boolean;
}) => {
  return `scrollPos_${pathname}${extendQueryParams && query ? `_${query}` : ''}`;
};
