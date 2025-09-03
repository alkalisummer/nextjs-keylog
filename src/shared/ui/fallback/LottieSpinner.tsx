'use client';

import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './spinner.module.scss';

declare global {
  interface Window {
    lottie?: any;
  }
}

interface LottieSpinnerProps {
  animationData?: object;
  loop?: boolean;
  autoplay?: boolean;
  size?: number | string;
  delayMs?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_DELAY_MS = 150;
const LOTTIE_CDN_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';

let lottieLoadPromise: Promise<void> | null = null;
function ensureLottieLoaded(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.lottie) return Promise.resolve();
  if (lottieLoadPromise) return lottieLoadPromise;

  lottieLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LOTTIE_CDN_SRC}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load lottie script')));
      return;
    }

    const script = document.createElement('script');
    script.src = LOTTIE_CDN_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load lottie script'));
    document.body.appendChild(script);
  });

  return lottieLoadPromise;
}

export function LottieSpinner({
  animationData,
  loop = true,
  autoplay = true,
  size = 24,
  delayMs = DEFAULT_DELAY_MS,
  ariaLabel = 'Loading',
  className,
  style,
}: LottieSpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const id = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  useEffect(() => {
    if (!show) return;
    let anim: any | null = null;

    if (!animationData) return;

    let cancelled = false;
    ensureLottieLoaded()
      .then(() => {
        if (cancelled) return;
        if (!containerRef.current || !window.lottie) return;
        anim = window.lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData,
        });
      })
      .catch(() => {
        /* fall back silently */
      });

    return () => {
      cancelled = true;
      if (anim) {
        try {
          anim.destroy();
        } catch (_) {}
      }
    };
  }, [show, animationData, loop, autoplay]);

  const resolvedSize = useMemo(() => (typeof size === 'number' ? `${size}px` : size), [size]);

  if (!show) return null;

  return (
    <div
      className={cn(styles.spinnerRoot, className)}
      style={{ width: resolvedSize, height: resolvedSize, ...style }}
      role="status"
      aria-label={ariaLabel}
    >
      {animationData ? (
        <div ref={containerRef} className={styles.lottieContainer} />
      ) : (
        <div className={styles.cssSpinner} aria-hidden />
      )}
    </div>
  );
}
