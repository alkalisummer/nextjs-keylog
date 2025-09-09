'use server';

import { join } from 'path';
import { ObjectStorageClient } from 'oci-objectstorage';
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common';

export const objectStorageClient = async () => {
  const ociConfigFilePath =
    process.env.NODE_ENV === 'production'
      ? process.env.OCI_CONFIG_PATH
      : join(process.cwd(), 'src/shared/lib/oci/config');
  const provider = new ConfigFileAuthenticationDetailsProvider(ociConfigFilePath);
  const storageClient = new ObjectStorageClient({ authenticationDetailsProvider: provider });

  const namespace = process.env.CLOUD_BUCKET_NAME_SPACE ?? '';
  const bucketName = process.env.CLOUD_BUCKET_NAME ?? '';

  return {
    get: async (objectName: string) => {
      const getObjectRequest = {
        namespaceName: namespace,
        bucketName: bucketName,
        objectName: objectName,
      };
      return await storageClient.getObject(getObjectRequest);
    },
    put: async (image: File) => {
      console.log('image', image);
      const contentType = image.type || 'application/octet-stream';
      const bodyBuffer = Buffer.from(await image.arrayBuffer());

      const putObjectRequest = {
        namespaceName: namespace,
        bucketName: bucketName,
        objectName: image.name,
        contentLength: bodyBuffer.byteLength,
        putObjectBody: bodyBuffer,
        contentType,
        contentDisposition: 'inline',
      };
      await storageClient.putObject(putObjectRequest);
    },
    delete: async (objectName: string) => {
      const deleteObjectRequest = {
        namespaceName: namespace,
        bucketName: bucketName,
        objectName: objectName,
      };
      await storageClient.deleteObject(deleteObjectRequest);
    },
  };
};
