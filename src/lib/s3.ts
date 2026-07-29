import { S3Client } from '@aws-sdk/client-s3';

import env from '~/lib/env';

const globalForS3 = globalThis as typeof globalThis & {
  s3?: S3Client;
};

const s3 =
  globalForS3.s3 ??
  new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

if (import.meta.env.DEV) {
  globalForS3.s3 = s3;
}

export default s3;
