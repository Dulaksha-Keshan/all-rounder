import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3ClientConfig: ConstructorParameters<typeof S3Client>[0] = {
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
};

if (process.env.R2_ENDPOINT) {
  s3ClientConfig.endpoint = process.env.R2_ENDPOINT;
}

const s3Client = new S3Client(s3ClientConfig);

export const uploadToR2 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "",
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
  });

  await s3Client.send(command);
  return `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "",
    Key: key,
  });

  await s3Client.send(command);
};
