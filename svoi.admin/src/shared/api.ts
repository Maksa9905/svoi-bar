import { session } from "./session";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function apiBase(): string {
  return import.meta.env.VITE_API_URL ?? "http://localhost:3001";
}

export function assetUrl(url: string): string {
  if (url.startsWith("/api/")) {
    return `${apiBase()}${url}`;
  }
  return url;
}

export function errorText(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Не получилось выполнить запрос";
}

function messageFromBody(body: unknown): string {
  if (!body || typeof body !== "object" || !("message" in body)) {
    return "Запрос не прошёл";
  }
  const message = body.message;
  return Array.isArray(message) ? message.join(", ") : String(message);
}

async function refreshAccess(): Promise<boolean> {
  if (!session.refreshToken) {
    return false;
  }
  const response = await fetch(`${apiBase()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });
  if (!response.ok) {
    session.clear();
    return false;
  }
  const data = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  session.setTokens(data.accessToken, data.refreshToken);
  return true;
}

export async function api<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (session.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBase()}${path}`, { ...init, headers });
  if (response.status === 401 && retry && (await refreshAccess())) {
    return api<T>(path, init, false);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(messageFromBody(body), response.status);
  }
  return body as T;
}
