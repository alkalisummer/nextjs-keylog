'use server';

import { formatDate } from '@/shared/lib/util';
import { objectStorageClient } from '@/shared/lib/oci';

export const uploadPostImage = async (image: File) => {
  const objectStorage = await objectStorageClient();
  const originalType = (image.type || '').toLowerCase();
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heic',
  };

  const ext = mimeToExt[originalType] || 'jpg';
  const targetMime = originalType || (ext === 'jpg' ? 'image/jpeg' : `image/${ext}`);
  const imageName = `IMG${formatDate({ date: new Date(), isFullTime: true })}.${ext}`;
  const customImageFile = new File([image], imageName, { type: targetMime });

  try {
    await objectStorage.put(customImageFile);
    const imageUrl = `${process.env.CLOUD_BUCKET_URL}/${imageName}`;
    return {
      ok: true,
      status: 200,
      data: imageUrl,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload post image');
  }
};
