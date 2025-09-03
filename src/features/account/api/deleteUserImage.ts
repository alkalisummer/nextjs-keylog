'use server';

import { client } from '@/shared/lib/client';
import { parseUserImageFileName } from '../lib';
import { objectStorageClient } from '@/shared/lib/oci';

export const deleteUserImage = async (userImageUrl: string) => {
  if (userImageUrl === '') {
    return {
      ok: true,
      status: 200,
    };
  }

  const objectStorage = await objectStorageClient();
  const imgName = parseUserImageFileName(userImageUrl);
  try {
    await objectStorage.delete(imgName);
    const res = await client.user().delete({
      endpoint: `/delete/image`,
    });
    return {
      ok: res.ok,
      status: res.status,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete image');
  }
};
