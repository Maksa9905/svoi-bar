import { apiUrl } from "@/shared/config/api";
import { siteDocumentSchema, type SiteDocument } from "../model/schema";

export const siteQueryKey = ["site"] as const;

export async function fetchSite(baseUrl?: string): Promise<SiteDocument> {
  const response = await fetch(`${baseUrl ?? apiUrl()}/api/site`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Не удалось загрузить сайт");
  }

  return siteDocumentSchema.parse(await response.json());
}
