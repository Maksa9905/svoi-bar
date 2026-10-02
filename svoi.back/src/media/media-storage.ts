export type StoredFile = {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
};

export interface MediaStorage {
  save(file: StoredFile): Promise<{ storageKey: string }>;
  read(storageKey: string): Promise<Buffer>;
  remove(storageKey: string): Promise<void>;
}

export const MEDIA_STORAGE = Symbol('MEDIA_STORAGE');
