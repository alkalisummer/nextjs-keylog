'use server';

import { client } from '@/shared/lib/client';
import { formatDate } from '@/shared/lib/util';
import { getCustomSession } from '@/shared/lib/util';
import { objectStorageClient } from '@/shared/lib/oci';

export const uploadUserImage = async (image: File) => {
  const session = await getCustomSession();
  const objectStorage = await objectStorageClient();

  if (session?.user) {
    const userId = session.user.id;
    const imageName = `IMG${formatDate({ date: new Date(), isFullTime: true })}`;
    const customImageFile = new File([image], imageName, { type: image.type });

    try {
      await objectStorage.put(customImageFile);
      const imageUrl = `${process.env.CLOUD_BUCKET_URL}/${imageName}`;
      const res = await client.user().put({
        endpoint: `/${userId}/image`,
        options: {
          body: {
            imageUrl,
          },
        },
      });
      return {
        ok: res.ok,
        status: res.status,
        data: imageUrl,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to upload image');
    }
  }
};
