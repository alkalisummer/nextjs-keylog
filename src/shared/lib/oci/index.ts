'use server';

import { join } from 'path';
import { ObjectStorageClient } from 'oci-objectstorage';
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common';
import { OCI_OBJECT_CACHE_SECONDS } from '@/shared/lib/constants/number/number.constant';

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
    put: async (
      image: File,
      options?: { cacheSeconds?: number; cacheControl?: string; contentDisposition?: string },
    ) => {
      const contentType = image.type || 'application/octet-stream';
      const bodyBuffer = Buffer.from(await image.arrayBuffer());

      const defaultCacheSeconds = options?.cacheSeconds ?? OCI_OBJECT_CACHE_SECONDS;
      const cacheControl = options?.cacheControl ?? `public, max-age=${defaultCacheSeconds}, immutable`;

      const putObjectRequest = {
        namespaceName: namespace,
        bucketName: bucketName,
        objectName: image.name,
        contentLength: bodyBuffer.byteLength,
        putObjectBody: bodyBuffer,
        contentType,
        contentDisposition: options?.contentDisposition ?? 'inline',
        cacheControl,
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
