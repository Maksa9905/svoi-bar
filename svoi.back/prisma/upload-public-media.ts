import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { S3MediaStorage } from '../src/media/s3-media.storage';

const publicRoot = path.resolve(__dirname, '../../svoi.web/public');
const mimeByExt: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

async function main() {
  const prisma = new PrismaClient();
  const storage = new S3MediaStorage();
  const rows = await prisma.media.findMany({
    where: { storageKey: { startsWith: '/' } },
  });

  for (const row of rows) {
    const filePath = path.join(publicRoot, row.storageKey);
    const extension = path.extname(row.storageKey).toLowerCase();
    const mimeType = mimeByExt[extension] ?? row.mimeType;
    const body = await readFile(filePath);
    const storageKey = `media/${row.id}${extension}`;
    await storage.put(storageKey, body, mimeType);
    await prisma.media.update({
      where: { id: row.id },
      data: { storageKey, mimeType },
    });
    console.log(row.storageKey, '->', storageKey);
  }

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
