'use client';

import { gsap } from 'gsap';
import './InfiniteScroll.scss';
import { Observer } from 'gsap/Observer';
import { Trend } from '@/entities/trend/model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useEffect, ReactNode, useMemo, useCallback, useState } from 'react';

gsap.registerPlugin(Observer);

interface InfiniteScrollItem {
  content: ReactNode;
  data?: any;
}

interface InfiniteScrollProps {
  width?: string;
  maxHeight?: string;
  negativeMargin?: string;
  items?: InfiniteScrollItem[];
  selectedItemInitData?: Trend;
  itemMinHeight?: number;
  itemMinWidth?: number;
  isTilted?: boolean;
  tiltDirection?: 'left' | 'right';
  tiltAngle?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: 'down' | 'up';
  pauseOnHover?: boolean;
  onClick?: (data?: any) => void;
  refresh?: () => void;
}

export const InfiniteScroll = ({
  width = '30rem',
  maxHeight = '100%',
  negativeMargin = '-0.5em',
  items = [],
  selectedItemInitData,
  itemMinHeight = 130,
  itemMinWidth = 300,
  isTilted = false,
  tiltDirection = 'left',
  tiltAngle = 20,
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = 'down',
  pauseOnHover = false,
  onClick,
  refresh,
}: InfiniteScrollProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItemData, setSelectedItemData] = useState<Trend | null>(selectedItemInitData || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [isTemporarilyPaused, setIsTemporarilyPaused] = useState<boolean>(false);
  const divItemsRef = useRef<HTMLDivElement[]>([]);
  const wrapFnRef = useRef<((value: number) => number) | null>(null);
  const observerRef = useRef<Observer | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedItemData(selectedItemInitData || null);
  }, [selectedItemInitData]);

  // 스타일 객체들을 메모이제이션
  const dynamicStyles = useMemo(
    () => ({
      wrapperStyle: `
      .infinite-scroll-wrapper {
        max-height: ${maxHeight};
      }

      .infinite-scroll-container {
        width: ${width};
        min-width: ${itemMinWidth}px;
      }

      .infinite-scroll-item {
        height: ${itemMinHeight}px;
        margin-top: ${negativeMargin};
      }
    `,
      containerTransform: isTilted
        ? tiltDirection === 'left'
          ? `rotateX(${tiltAngle}deg) rotateZ(-${tiltAngle}deg) skewX(${tiltAngle}deg)`
          : `rotateX(${tiltAngle}deg) rotateZ(${tiltAngle}deg) skewX(-${tiltAngle}deg)`
        : 'none',
    }),
    [maxHeight, width, itemMinWidth, itemMinHeight, negativeMargin, isTilted, tiltDirection, tiltAngle],
  );

  // onClick 핸들러를 메모이제이션
  const handleItemClick = useCallback(
    (data?: any) => {
      setSelectedItemData(data);
      onClick?.(data);
      setIsPlaying(false);
    },
    [onClick],
  );

  // useEffect dependency를 줄이기 위해 핵심 값들만 포함
  const animationConfig = useMemo(
    () => ({
      autoplaySpeed,
      autoplayDirection,
      pauseOnHover,
    }),
    [autoplaySpeed, autoplayDirection, pauseOnHover],
  );

  // 1) 초기 배치 및 Observer 설정 (아이템 변경에만 반응)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (items.length === 0) return;

    const divItems = gsap.utils.toArray<HTMLDivElement>(container.children);
    if (!divItems.length) return;

    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemHeight = firstItem.offsetHeight;
    const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;

    const actualItemSpacing = itemHeight + itemMarginTop;
    const totalHeight = items.length * actualItemSpacing;
    const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

    divItems.forEach((child, i) => {
      const y = i * actualItemSpacing;
      gsap.set(child, { y });
    });

    divItemsRef.current = divItems;
    wrapFnRef.current = wrapFn as (value: number) => number;

    // 기존 Observer 정리 후 재생성
    observerRef.current?.kill();
    observerRef.current = Observer.create({
      target: container,
      type: 'wheel,touch,pointer',
      preventDefault: true,
      onPress: ({ target }) => {
        (target as HTMLElement).style.cursor = 'grabbing';
      },
      onRelease: ({ target }) => {
        (target as HTMLElement).style.cursor = 'grab';
      },
      onChange: ({ deltaY, isDragging, event }) => {
        const d = event.type === 'wheel' ? -deltaY : deltaY;
        const distance = isDragging ? d * 5 : d * 10;
        const currentWrap = wrapFnRef.current;
        const currentItems = divItemsRef.current;
        if (!currentWrap || !currentItems.length) return;
        currentItems.forEach(child => {
          gsap.to(child, {
            duration: 0.5,
            ease: 'expo.out',
            y: `+=${distance}`,
            modifiers: {
              y: gsap.utils.unitize(currentWrap),
            },
          });
        });
      },
    });

    return () => {
      observerRef.current?.kill();
      observerRef.current = null;
    };
  }, [items]);

  // 2) 자동 스크롤 RAF 제어 (재생/정지 시 위치 유지)
  useEffect(() => {
    const container = containerRef.current;
    const currentWrap = wrapFnRef.current;
    if (!container || !currentWrap) return;

    // 정지: RAF 해제만 수행
    if (!isPlaying) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setIsTemporarilyPaused(false);
      return;
    }

    const directionFactor = animationConfig.autoplayDirection === 'down' ? 1 : -1;
    const speedPerFrame = animationConfig.autoplaySpeed * directionFactor;

    const tick = () => {
      const currentItems = divItemsRef.current;
      const wrap = wrapFnRef.current;
      if (!currentItems.length || !wrap) return;
      currentItems.forEach(child => {
        gsap.set(child, {
          y: `+=${speedPerFrame}`,
          modifiers: {
            y: gsap.utils.unitize(wrap),
          },
        });
      });
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    setIsTemporarilyPaused(false);

    let stopTicker: (() => void) | null = null;
    let startTicker: (() => void) | null = null;

    if (animationConfig.pauseOnHover) {
      stopTicker = () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        setIsTemporarilyPaused(true);
      };
      startTicker = () => {
        if (!rafIdRef.current) {
          setIsTemporarilyPaused(false);
          rafIdRef.current = requestAnimationFrame(tick);
        }
      };
      container.addEventListener('mouseenter', stopTicker);
      container.addEventListener('mouseleave', startTicker);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setIsTemporarilyPaused(false);
      if (stopTicker) container.removeEventListener('mouseenter', stopTicker);
      if (startTicker) container.removeEventListener('mouseleave', startTicker);
    };
  }, [isPlaying, animationConfig]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <>
      <style>{dynamicStyles.wrapperStyle}</style>
      <div className="infinite-scroll-wrapper" ref={wrapperRef}>
        <div
          className="infinite-scroll-container"
          ref={containerRef}
          style={{
            transform: dynamicStyles.containerTransform,
          }}
        >
          {items.map((item, i) => (
            <div
              className={`infinite-scroll-item ${
                selectedItemData?.keyword === item.data?.keyword ? 'selected-item' : ''
              }`}
              key={i}
              onClick={() => handleItemClick(item.data)}
            >
              {i === 0 ? item.content : <span>{item.content}</span>}
            </div>
          ))}
        </div>
        <div className="infinite-scroll-controll">
          <FontAwesomeIcon icon={faArrowRotateRight} className="icon" onClick={refresh} title="새로고침" />
          {isPlaying && !isTemporarilyPaused ? (
            <FontAwesomeIcon icon={faPause} className="icon" onClick={handlePause} title="일시 정지" />
          ) : (
            <FontAwesomeIcon icon={faPlay} className="icon" onClick={handlePlay} title="재생" />
          )}
        </div>
      </div>
    </>
  );
};
