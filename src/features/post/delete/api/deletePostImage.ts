'use server';

import { objectStorageClient } from '@/shared/lib/oci';

export const deletePostImage = async (imgFileArr: string[]) => {
  const objectStorage = await objectStorageClient();

  for (const imgName of imgFileArr) {
    try {
      await objectStorage.delete(imgName);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete image');
    }
  }
};
