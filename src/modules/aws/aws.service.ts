import config from "@/config";
import { s3Client } from "@/lib/aws";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class awsService {
  static s3Bucket = config.AWS.BUCKET_NAME;
  static async s3Upload(file: Buffer, key: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: awsService.s3Bucket,
      Key: key,
      Body: file,
      ContentType: mimetype,
    });

    await s3Client.send(command);

    return {
      key,
      url: `https://${awsService.s3Bucket}.s3.amazonaws.com/${key}`,
    };
  }
  static async s3Get(key: string) {
    if (!key) return null;

    try {
      const command = new GetObjectCommand({
        Bucket: awsService.s3Bucket,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch {
      return null;
    }
  }
}
