import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { MediaStorage, StoredFile } from './media-storage';

@Injectable()
export class LocalMediaStorage implements MediaStorage {
  private readonly root = join(process.cwd(), 'uploads');

  async save(file: StoredFile): Promise<{ storageKey: string }> {
    await mkdir(this.root, { recursive: true });
    const extension = extname(file.originalName).toLowerCase();
    const storageKey = `${randomUUID()}${extension}`;
    await writeFile(join(this.root, storageKey), file.buffer);
    return { storageKey };
  }

  read(storageKey: string): Promise<Buffer> {
    return readFile(join(this.root, storageKey));
  }

  async remove(storageKey: string): Promise<void> {
    await unlink(join(this.root, storageKey)).catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      },
    );
  }
}
