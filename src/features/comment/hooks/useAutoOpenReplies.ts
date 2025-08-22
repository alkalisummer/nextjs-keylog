'use client';

import { useEffect, useRef } from 'react';

export function useAutoOpenReplies(
  repliesLength: number,
  showReplies: boolean,
  setShowReplies: (open: boolean) => void,
) {
  const previousRepliesCountRef = useRef(repliesLength);

  useEffect(() => {
    const previousCount = previousRepliesCountRef.current;
    if (previousCount === 0 && repliesLength > 0 && !showReplies) {
      setShowReplies(true);
    }
    previousRepliesCountRef.current = repliesLength;
  }, [repliesLength, showReplies, setShowReplies]);
}
