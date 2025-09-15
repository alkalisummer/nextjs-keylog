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

  const restoreScrollPos = () => {
    const el = document.getElementById(scrollElementId);
    const scrollKey = `${path}`;
    const scrollTop = sessionStorage.getItem(scrollKey);

    console.log('scrollKey', scrollKey);
    console.log('scrollTop', scrollTop);
    if (!el || !scrollTop) return;

    requestAnimationFrame(() => {
      el.scrollTop = parseInt(scrollTop);
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
