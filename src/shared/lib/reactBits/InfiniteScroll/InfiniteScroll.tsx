'use client';

import { gsap } from 'gsap';
import './InfiniteScroll.css';
import { Observer } from 'gsap/Observer';
import { Trend } from '@/entities/trend/model';
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
}: InfiniteScrollProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItemData, setSelectedItemData] = useState<Trend | null>(selectedItemInitData || null);

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
    },
    [onClick],
  );

  // useEffect dependency를 줄이기 위해 핵심 값들만 포함
  const animationConfig = useMemo(
    () => ({
      autoplay,
      autoplaySpeed,
      autoplayDirection,
      pauseOnHover,
    }),
    [autoplay, autoplaySpeed, autoplayDirection, pauseOnHover],
  );

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

    // 실제 아이템 간 간격 (음수 마진 포함)
    const actualItemSpacing = itemHeight + itemMarginTop;

    // 무한 루프를 위한 전체 높이 계산
    const totalHeight = items.length * actualItemSpacing;
    const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

    divItems.forEach((child, i) => {
      const y = i * actualItemSpacing;
      gsap.set(child, { y });
    });

    const observer = Observer.create({
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
        divItems.forEach(child => {
          gsap.to(child, {
            duration: 0.5,
            ease: 'expo.out',
            y: `+=${distance}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    let rafId: number;
    if (animationConfig.autoplay) {
      const directionFactor = animationConfig.autoplayDirection === 'down' ? 1 : -1;
      const speedPerFrame = animationConfig.autoplaySpeed * directionFactor;

      const tick = () => {
        divItems.forEach(child => {
          gsap.set(child, {
            y: `+=${speedPerFrame}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      if (animationConfig.pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => {
          rafId = requestAnimationFrame(tick);
        };

        container.addEventListener('mouseenter', stopTicker);
        container.addEventListener('mouseleave', startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener('mouseenter', stopTicker);
          container.removeEventListener('mouseleave', startTicker);
        };
      } else {
        return () => {
          observer.kill();
          rafId && cancelAnimationFrame(rafId);
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [items, animationConfig]);

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
      </div>
    </>
  );
};
