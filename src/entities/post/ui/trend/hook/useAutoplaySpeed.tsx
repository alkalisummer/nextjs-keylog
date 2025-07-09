'use client';

import { useState, useEffect, useMemo } from 'react';
import { SpeedBreakpoints } from '../model';
import { DEFAULT_SPEEDS } from '@/shared/lib/constants';

export const useAutoplaySpeed = (customSpeeds?: SpeedBreakpoints) => {
  const [autoplaySpeed, setAutoplaySpeed] = useState(1);

  const speeds = useMemo(() => {
    return { ...DEFAULT_SPEEDS, ...customSpeeds };
  }, [customSpeeds]);

  useEffect(() => {
    const updateSpeed = () => {
      const width = window.innerWidth;

      let newSpeed: number;
      if (width >= 1200) {
        newSpeed = speeds.desktop;
      } else if (width >= 768) {
        newSpeed = speeds.tablet;
      } else {
        newSpeed = speeds.mobile;
      }

      setAutoplaySpeed(prevSpeed => {
        if (prevSpeed === newSpeed) return prevSpeed;
        return newSpeed;
      });
    };

    // 초기 속도 설정
    updateSpeed();

    // 화면 크기 변화 감지
    const resizeObserver = new ResizeObserver(updateSpeed);

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener('resize', updateSpeed);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSpeed);
    };
  }, [speeds]);

  return autoplaySpeed;
};
