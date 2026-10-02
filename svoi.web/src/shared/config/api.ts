export function apiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
}

export function resolveAssetUrl(url: string): string {
  if (url.startsWith("/api/")) {
    return `${apiUrl()}${url}`;
  }

  return url;
}
