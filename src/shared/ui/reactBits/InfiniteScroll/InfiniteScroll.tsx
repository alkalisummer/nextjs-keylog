import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import './InfiniteScroll.css';

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
  itemMinHeight?: number;
  itemMinWidth?: number;
  isTilted?: boolean;
  tiltDirection?: 'left' | 'right';
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: 'down' | 'up';
  pauseOnHover?: boolean;
  onClick?: (data?: any) => void;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  width = '30rem',
  maxHeight = '100%',
  negativeMargin = '-0.5em',
  items = [],
  itemMinHeight = 130,
  itemMinWidth = 300,
  isTilted = false,
  tiltDirection = 'left',
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = 'down',
  pauseOnHover = false,
  onClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getTiltTransform = (): string => {
    if (!isTilted) return 'none';
    return tiltDirection === 'left'
      ? 'rotateX(20deg) rotateZ(-20deg) skewX(20deg)'
      : 'rotateX(20deg) rotateZ(20deg) skewX(-20deg)';
  };

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
    // 마지막 아이템과 첫 번째 아이템 사이도 같은 간격을 유지
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
    if (autoplay) {
      const directionFactor = autoplayDirection === 'down' ? 1 : -1;
      const speedPerFrame = autoplaySpeed * directionFactor;

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

      if (pauseOnHover) {
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
  }, [items, autoplay, autoplaySpeed, autoplayDirection, pauseOnHover, isTilted, tiltDirection, negativeMargin]);

  return (
    <>
      <style>
        {`
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
        `}
      </style>
      <div className="infinite-scroll-wrapper" ref={wrapperRef}>
        <div
          className="infinite-scroll-container"
          ref={containerRef}
          style={{
            transform: getTiltTransform(),
          }}
        >
          {items.map((item, i) => (
            <div className="infinite-scroll-item" key={i} onClick={() => onClick?.(item.data)}>
              <span>{item.content}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
