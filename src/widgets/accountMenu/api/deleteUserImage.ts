'use server';

import { objectStorageClient } from '@/shared/lib/oci';
import { parseUserImageFileName } from '../lib';

export const deleteUserImage = async (userImageUrl: string) => {
  const objectStorage = await objectStorageClient();
  const imgName = parseUserImageFileName(userImageUrl);
  try {
    await objectStorage.delete(imgName);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete image');
  }
};
