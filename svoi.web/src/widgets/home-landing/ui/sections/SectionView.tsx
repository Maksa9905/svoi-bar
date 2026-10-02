import { ContactsSection } from "./contacts/ContactsSection";
import { CtaSection } from "./cta/CtaSection";
import { DishRowSection } from "./dish-row/DishRowSection";
import { FeaturePriceSection } from "./feature-price/FeaturePriceSection";
import { GalleryTeaserSection } from "./gallery-teaser/GalleryTeaserSection";
import { HeroSection } from "./hero/HeroSection";
import { IconCardsSection } from "./icon-cards/IconCardsSection";
import { MapSection } from "./map/MapSection";
import { MediaBandSection } from "./media-band/MediaBandSection";
import { PromoBannerSection } from "./promo-banner/PromoBannerSection";
import { SplitSection } from "./split/SplitSection";
import { TextMediaSection } from "./text-media/TextMediaSection";
import type { SectionProps } from "./types";

const sections = {
  hero: HeroSection,
  "text-media": TextMediaSection,
  "icon-cards": IconCardsSection,
  "feature-price": FeaturePriceSection,
  "promo-banner": PromoBannerSection,
  "media-band": MediaBandSection,
  split: SplitSection,
  "dish-row": DishRowSection,
  "gallery-teaser": GalleryTeaserSection,
  contacts: ContactsSection,
  map: MapSection,
  cta: CtaSection,
} as const;

export function SectionView({ site, section }: SectionProps) {
  const View = sections[section.type as keyof typeof sections];
  if (!View) {
    return null;
  }

  return <View site={site} section={section} />;
}
