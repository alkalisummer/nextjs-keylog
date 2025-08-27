'use client';

import { deletePostImage } from '@/features/post/api';
import { useCallback, useEffect, useState } from 'react';
import { getObjectNameFromUrl, extractImageNamesFromHtml, diff } from '@/features/post/lib';

interface UsePostImageManagerOptions {
  initialHtml?: string;
}

export function usePostImage(options?: UsePostImageManagerOptions) {
  const initialHtml = options?.initialHtml || '';

  const [uploadedImageNames, setUploadedImageNames] = useState<string[]>([]);
  const [originalImageNames, setOriginalImageNames] = useState<string[]>([]);

  useEffect(() => {
    setOriginalImageNames(extractImageNamesFromHtml(initialHtml));
  }, [initialHtml]);

  const addUploadedImage = useCallback((imageUrl: string) => {
    const objectName = getObjectNameFromUrl(imageUrl);
    setUploadedImageNames(prev => [...prev, objectName]);
    return objectName;
  }, []);

  const handleCancel = useCallback(async () => {
    if (uploadedImageNames.length > 0) {
      try {
        await deletePostImage(uploadedImageNames);
      } catch (error) {
        console.error('Failed to delete images on cancel:', error);
      }
    }
  }, [uploadedImageNames]);

  const cleanupBeforeSubmit = useCallback(
    async (htmlContent: string) => {
      const currentImageNames = extractImageNamesFromHtml(htmlContent);
      const unusedUploads = diff(uploadedImageNames, currentImageNames);

      if (unusedUploads.length > 0) {
        try {
          await deletePostImage(unusedUploads);
        } catch (error) {
          console.error('Failed to delete unused uploaded images:', error);
        }
      }

      return { currentImageNames } as const;
    },
    [uploadedImageNames],
  );

  const cleanupAfterUpdateSuccess = useCallback(
    async (currentImageNames: string[]) => {
      const removedFromOriginal = diff(originalImageNames, currentImageNames);
      if (removedFromOriginal.length > 0) {
        try {
          await deletePostImage(removedFromOriginal);
        } catch (error) {
          console.error('Failed to delete removed original images:', error);
        }
      }
    },
    [originalImageNames],
  );

  return {
    addUploadedImage,
    handleCancel,
    cleanupBeforeSubmit,
    cleanupAfterUpdateSuccess,
  } as const;
}
