'use client';

import { isClient } from '../validate';

export type ScrollBehaviorType = 'auto' | 'smooth';

export interface ResolveContainerOptions {
  container?: Element | string | null;
}

export interface ScrollBaseOptions extends ResolveContainerOptions {
  behavior?: ScrollBehaviorType;
}

export interface ScrollWithOffsetOptions extends ScrollBaseOptions {
  offset?: number;
}

export const afterNextFrame = (callback: () => void) => {
  if (!isClient()) return;
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => callback());
  } else {
    setTimeout(() => callback(), 0);
  }
};

export const resolveScrollContainer = ({ container }: ResolveContainerOptions = {}): HTMLElement => {
  if (!isClient()) return {} as unknown as HTMLElement;

  if (container instanceof Element) {
    return container as HTMLElement;
  }

  if (typeof container === 'string') {
    const found = document.querySelector(container);
    if (found) return found as HTMLElement;
  }

  const root = document.querySelector('[data-scroll-root]');
  if (root) return root as HTMLElement;

  const scrollingElement = (document.scrollingElement || document.documentElement) as HTMLElement;
  return scrollingElement;
};

export const scrollToBottom = (options: ScrollWithOffsetOptions = {}) => {
  if (!isClient()) return;
  const { behavior = 'smooth', offset = 0 } = options;
  const el = resolveScrollContainer(options);
  afterNextFrame(() => {
    el.scrollTo({ top: el.scrollHeight + offset, behavior });
  });
};

export const scrollToTop = (options: ScrollWithOffsetOptions = {}) => {
  if (!isClient()) return;
  const { behavior = 'smooth', offset = 0 } = options;
  const el = resolveScrollContainer(options);
  afterNextFrame(() => {
    el.scrollTo({ top: 0 + offset, behavior });
  });
};

export const scrollElementIntoView = (target: Element, options: ScrollBaseOptions = {}) => {
  if (!isClient()) return;
  const { behavior = 'smooth' } = options;
  if (!options.container) {
    (target as HTMLElement).scrollIntoView({ behavior, block: 'nearest' });
    return;
  }

  const container = resolveScrollContainer(options);
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const deltaTop = targetRect.top - containerRect.top;
  const deltaBottom = targetRect.bottom - containerRect.bottom;

  let nextTop = container.scrollTop;
  if (deltaTop < 0) {
    nextTop = nextTop + deltaTop;
  } else if (deltaBottom > 0) {
    nextTop = nextTop + deltaBottom;
  }

  afterNextFrame(() => {
    container.scrollTo({ top: nextTop, behavior });
  });
};
