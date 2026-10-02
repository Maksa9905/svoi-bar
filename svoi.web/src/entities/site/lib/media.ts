import type { SiteDocument } from "../model/schema";
import { resolveAssetUrl } from "@/shared/config/api";

export function mediaUrl(site: SiteDocument, id: string | undefined): string | undefined {
  if (!id) {
    return undefined;
  }

  const asset = site.media[id];
  return asset ? resolveAssetUrl(asset.url) : undefined;
}
