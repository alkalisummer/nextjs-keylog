'use client';

import { useEffect, useRef } from 'react';
import ClipboardJS from 'clipboard';

interface UseClipboardProps {
  elementId: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export const useClipboard = ({ elementId, onSuccess, onError }: UseClipboardProps) => {
  const clipboardRef = useRef<ClipboardJS | null>(null);

  useEffect(() => {
    if (!clipboardRef.current) {
      clipboardRef.current = new ClipboardJS(`#${elementId}`);

      clipboardRef.current.on('success', function (e) {
        onSuccess?.() || alert('클립보드에 복사되었습니다.');
        e.clearSelection();
      });

      clipboardRef.current.on('error', function (e) {
        onError?.() || alert('클립보드 복사를 실패하였습니다.');
      });
    }

    return () => {
      if (clipboardRef.current) {
        clipboardRef.current.destroy();
        clipboardRef.current = null;
      }
    };
  }, [elementId, onSuccess, onError]);

  return clipboardRef.current;
};
