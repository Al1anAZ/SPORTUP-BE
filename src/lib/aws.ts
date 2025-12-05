import config from "@/config";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: config.AWS.REGION,
  credentials: {
    accessKeyId: config.AWS.ACCESS_KEY_ID,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
  },
});
