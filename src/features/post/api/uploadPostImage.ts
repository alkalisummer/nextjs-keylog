'use server';

import { formatDate } from '@/shared/lib/util';
import { objectStorageClient } from '@/shared/lib/oci';

export const uploadPostImage = async (image: File) => {
  const objectStorage = await objectStorageClient();
  const imageName = `IMG${formatDate({ date: new Date(), isFullTime: true })}`;
  const customImageFile = new File([image], imageName, { type: image.type });
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
