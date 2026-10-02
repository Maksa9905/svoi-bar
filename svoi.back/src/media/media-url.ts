export function mediaPublicUrl(id: string, storageKey: string): string {
  if (storageKey.startsWith('/') || storageKey.startsWith('http')) {
    return storageKey;
  }

  const base = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
  if (base) {
    return `${base}/${storageKey}`;
  }

  return `/api/media/${id}/file`;
}
