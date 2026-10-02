import { makeAutoObservable } from "mobx";

const accessKey = "svoi.admin.access";
const refreshKey = "svoi.admin.refresh";

function readStored(key: string): string {
  if (typeof localStorage === "undefined") {
    return "";
  }
  return localStorage.getItem(key) ?? "";
}

function writeStored(key: string, value: string | null): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  if (value === null) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, value);
}

class SessionStore {
  accessToken = readStored(accessKey);
  refreshToken = readStored(refreshKey);

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated(): boolean {
    return this.accessToken.length > 0;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    writeStored(accessKey, accessToken);
    writeStored(refreshKey, refreshToken);
  }

  clear(): void {
    this.accessToken = "";
    this.refreshToken = "";
    writeStored(accessKey, null);
    writeStored(refreshKey, null);
  }
}

export const session = new SessionStore();
