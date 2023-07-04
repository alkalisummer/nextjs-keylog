import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectStorageClient } from 'oci-objectstorage';

export default async function DeletesImgFile(request: NextApiRequest, response: NextApiResponse) {
  const param = request.body.removedImg;
  const path = require('path');
  const ociConfigFilePath = path.join(process.cwd(), 'config');

  const common = require('oci-common');

  const provider = new common.ConfigFileAuthenticationDetailsProvider(ociConfigFilePath);
  const objectStorageClient = new ObjectStorageClient({ authenticationDetailsProvider: provider });

  const namespace = process.env.CLOUD_BUCKET_NAME_SPACE;
  const bucketName = process.env.CLOUD_BUCKET_NAME;

  await new Promise((resolve, reject) => {
    for (let img of param) {
      const deleteRequest = {
        namespaceName: namespace!,
        bucketName: bucketName!,
        objectName: img,
      };

      objectStorageClient
        .deleteObject(deleteRequest)
        .then((response) => {
          console.log('Objects deleted successfully');
        })
        .catch((err) => {
          reject(console.error('Error deleting objects:', err));
        });
    }
    resolve(response.status(200).json({ message: 'Delete Complete!' }));
  });
}
