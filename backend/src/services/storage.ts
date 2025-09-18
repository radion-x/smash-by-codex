import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../lib/config'

const s3 = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  forcePathStyle: !!config.s3.endpoint,
  credentials: config.s3.accessKeyId ? { accessKeyId: config.s3.accessKeyId!, secretAccessKey: config.s3.secretAccessKey! } : undefined,
})

export async function putObject(key: string, body: Buffer, contentType: string) {
  await s3.send(new PutObjectCommand({ Bucket: config.s3.bucket, Key: key, Body: body, ContentType: contentType }))
  return { key }
}

export async function getObjectUrl(key: string, ttlSeconds = 60) {
  const cmd = new GetObjectCommand({ Bucket: config.s3.bucket, Key: key })
  return await getSignedUrl(s3, cmd, { expiresIn: ttlSeconds })
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: config.s3.bucket, Key: key }))
}
