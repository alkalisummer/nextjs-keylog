'use server';

import { join } from 'path';
import { ObjectStorageClient } from 'oci-objectstorage';
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common';

export const deleteImg = async (imgFileArr: string[]) => {
  const ociConfigFilePath = join(process.cwd(), '/src/shared/config/config');
  const provider = new ConfigFileAuthenticationDetailsProvider(ociConfigFilePath);
  const objectStorageClient = new ObjectStorageClient({ authenticationDetailsProvider: provider });

  const namespace = process.env.CLOUD_BUCKET_NAME_SPACE;
  const bucketName = process.env.CLOUD_BUCKET_NAME;

  for (const img of imgFileArr) {
    const deleteRequest = {
      namespaceName: namespace!,
      bucketName: bucketName!,
      objectName: img,
    };

    try {
      await objectStorageClient.deleteObject(deleteRequest);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete image');
    }
  }
};
