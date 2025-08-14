'use server';

import { client } from '@/shared/lib/client';
import { parseUserImageFileName } from '../lib';
import { getCustomSession } from '@/shared/lib/util';
import { objectStorageClient } from '@/shared/lib/oci';

export const deleteUserImage = async (userImageUrl: string) => {
  const session = await getCustomSession();
  const userId = session?.user?.id;

  if (!userImageUrl || !userId) {
    return;
  }
  const objectStorage = await objectStorageClient();
  const imgName = parseUserImageFileName(userImageUrl);
  try {
    await objectStorage.delete(imgName);
    const res = await client.user().delete({
      endpoint: `/${userId}/image`,
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
