import { mediaUrl, type SiteDocument, type SiteSection } from "@/entities/site";

export type SectionProps = {
  site: SiteDocument;
  section: SiteSection;
};

export function mediaSrc(site: SiteDocument, id: string | undefined): string | undefined {
  return mediaUrl(site, id);
}
