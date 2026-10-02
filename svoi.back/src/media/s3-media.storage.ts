import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import type { MediaStorage, StoredFile } from './media-storage';

@Injectable()
export class S3MediaStorage implements MediaStorage {
  private readonly client = new S3Client({
    region: process.env.S3_REGION ?? 'ru-1',
    endpoint: process.env.S3_ENDPOINT ?? 'https://s3.regru.cloud',
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    },
  });

  private readonly bucket = process.env.S3_BUCKET ?? '';

  async save(file: StoredFile): Promise<{ storageKey: string }> {
    const extension = extname(file.originalName).toLowerCase();
    const storageKey = `media/${randomUUID()}${extension}`;
    await this.put(storageKey, file.buffer, file.mimeType);
    return { storageKey };
  }

  async put(storageKey: string, body: Buffer, mimeType: string): Promise<void> {
    const input = {
      Bucket: this.bucket,
      Key: storageKey,
      Body: body,
      ContentType: mimeType,
    };
    try {
      await this.client.send(new PutObjectCommand({ ...input, ACL: 'public-read' }));
    } catch (error) {
      const name = error instanceof Error ? error.name : '';
      if (name !== 'AccessControlListNotSupported' && name !== 'NotImplemented') {
        throw error;
      }
      await this.client.send(new PutObjectCommand(input));
    }
  }

  async read(storageKey: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      }),
    );
    const bytes = await response.Body?.transformToByteArray();
    if (!bytes) {
      throw new Error('Пустой файл в хранилище');
    }
    return Buffer.from(bytes);
  }

  async remove(storageKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      }),
    );
  }
}
