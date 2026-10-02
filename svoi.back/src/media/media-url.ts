export function mediaPublicUrl(id: string, storageKey: string): string {
  if (storageKey.startsWith('/')) {
    return storageKey;
  }

  return `/api/media/${id}/file`;
}
