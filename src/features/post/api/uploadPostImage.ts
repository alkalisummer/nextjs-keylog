'use server';

import sharp from 'sharp';
import { formatDate } from '@/shared/lib/util';
import { objectStorageClient } from '@/shared/lib/oci';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

export const uploadPostImage = async (image: File) => {
  const objectStorage = await objectStorageClient();
  const imageName = `IMG${formatDate({ date: new Date(), isFullTime: true })}.webp`;

  try {
    const inputBuffer = Buffer.from(await image.arrayBuffer());
    const webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: NUMBER_CONSTANTS.POST_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: NUMBER_CONSTANTS.POST_IMAGE_QUALITY })
      .toBuffer();

    const webpFile = new File([webpBuffer], imageName, { type: 'image/webp' });
    await objectStorage.put(webpFile);
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
