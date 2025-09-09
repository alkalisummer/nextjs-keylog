'use server';

import { formatDate } from '@/shared/lib/util';
import { objectStorageClient } from '@/shared/lib/oci';

export const uploadPostImage = async (image: File) => {
  const objectStorage = await objectStorageClient();

  const originalType = (image.type || '').toLowerCase();

  const sniffExtAndMime = async (): Promise<{ ext: string; mime: string }> => {
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

    if (mimeToExt[originalType]) {
      return { ext: mimeToExt[originalType], mime: originalType };
    }

    // MIME이 비어있거나 불명확하면 시그니처로 추정
    try {
      const buffer = new Uint8Array(await image.arrayBuffer());
      // JPEG: FF D8 FF
      if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return { ext: 'jpg', mime: 'image/jpeg' };
      }
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      ) {
        return { ext: 'png', mime: 'image/png' };
      }
      // GIF: GIF8
      if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
        return { ext: 'gif', mime: 'image/gif' };
      }
      // WEBP: RIFF....WEBP
      if (
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
      ) {
        return { ext: 'webp', mime: 'image/webp' };
      }
      // HEIC/HEIF: ftypheic or ftypheif (대략적 판별)
      if (
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x68 &&
        buffer[9] === 0x65 &&
        buffer[10] === 0x69 &&
        buffer[11] === 0x63
      ) {
        return { ext: 'heic', mime: 'image/heic' };
      }
    } catch {}

    // 최후의 수단: jpg로 저장
    return { ext: 'jpg', mime: 'image/jpeg' };
  };

  const { ext, mime } = await sniffExtAndMime();
  const baseName = `IMG${formatDate({ date: new Date(), isFullTime: true })}`;
  const objectName = `${baseName}.${ext}`;
  const customImageFile = new File([image], objectName, { type: mime });

  try {
    await objectStorage.put(customImageFile);
    const imageUrl = `${process.env.CLOUD_BUCKET_URL}/${objectName}`;
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
