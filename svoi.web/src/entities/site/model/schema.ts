import { z } from "zod";

export const mediaAssetSchema = z.object({
  id: z.string(),
  alt: z.string(),
  mimeType: z.string(),
  url: z.string(),
});

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  descriptor: z.string(),
  phone: z.string(),
  address: z.string(),
  hours: z.string(),
  lat: z.number(),
  lon: z.number(),
  legal: z.string(),
});

export const navLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  sortOrder: z.number(),
  target: z.discriminatedUnion("type", [
    z.object({ type: z.literal("page"), path: z.string().nullable() }),
    z.object({ type: z.literal("action"), action: z.string().nullable() }),
    z.object({
      type: z.literal("section"),
      sectionId: z.string(),
      anchor: z.string(),
      href: z.string(),
    }),
    z.object({ type: z.literal("broken"), sectionId: z.string().nullable() }),
  ]),
});

export const menuItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  accent: z.string(),
  alt: z.string(),
  sortOrder: z.number(),
  filter: z.object({ id: z.string(), slug: z.string(), label: z.string() }),
  group: z.object({ id: z.string(), title: z.string() }),
  media: mediaAssetSchema,
});

export const siteMenuSchema = z.object({
  filters: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      label: z.string(),
      sortOrder: z.number(),
    }),
  ),
  groups: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      sortOrder: z.number(),
    }),
  ),
  items: z.array(menuItemSchema),
});

export const galleryItemSchema = z.object({
  id: z.string(),
  caption: z.string(),
  alt: z.string(),
  height: z.number(),
  sortOrder: z.number(),
  showOnHome: z.boolean(),
  homeSortOrder: z.number().nullable(),
  mascotSide: z.string().nullable(),
  media: mediaAssetSchema,
  mascot: mediaAssetSchema.nullable(),
});

export const siteSectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  anchor: z.string().nullable(),
  sortOrder: z.number(),
  payload: z.unknown(),
});

export const siteDocumentSchema = z.object({
  venue: venueSchema.nullable(),
  header: z.array(navLinkSchema),
  footer: z.array(navLinkSchema),
  sections: z.array(siteSectionSchema),
  media: z.record(z.string(), mediaAssetSchema),
  menu: siteMenuSchema,
  gallery: z.object({
    items: z.array(galleryItemSchema),
    home: z.array(galleryItemSchema),
  }),
});

const mediaId = z.string().min(1);

export const sectionPayloads = {
  hero: z.object({
    eyebrow: z.string(),
    kicker: z.string(),
    lead: z.string(),
    primaryLabel: z.string(),
    secondaryLabel: z.string(),
    secondaryHref: z.string(),
    backgroundDesktopMediaId: mediaId,
    backgroundMobileMediaId: mediaId,
    mascotMediaId: mediaId.optional(),
  }),
  "text-media": z.object({
    eyebrow: z.string(),
    eyebrowColor: z.string(),
    title: z.string(),
    body: z.string(),
    mediaId,
    mediaSide: z.enum(["left", "right"]),
  }),
  "icon-cards": z.object({
    title: z.string(),
    note: z.string(),
    cards: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
        iconMediaId: mediaId,
        color: z.string(),
      }),
    ),
  }),
  "feature-price": z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    price: z.string(),
    buttonLabel: z.string(),
    footnote: z.string(),
    mediaId,
  }),
  "promo-banner": z.object({
    title: z.string(),
    schedule: z.string(),
    days: z.string(),
    buttonLabel: z.string(),
    background: z.string(),
    mediaId,
  }),
  "media-band": z.object({
    eyebrow: z.string(),
    title: z.string(),
    note: z.string(),
    mediaId,
    labels: z.array(
      z.object({
        title: z.string(),
        price: z.string().optional(),
        accent: z.boolean().optional(),
      }),
    ),
  }),
  "dish-row": z.object({
    eyebrow: z.string(),
    title: z.string(),
    note: z.string(),
    buttonLabel: z.string(),
    buttonHref: z.string(),
    mascotMediaId: mediaId.optional(),
    dishes: z.array(
      z.object({
        title: z.string(),
        mediaId,
        alt: z.string(),
        tall: z.boolean(),
      }),
    ),
  }),
  split: z.object({
    eyebrow: z.string(),
    eyebrowColor: z.string(),
    title: z.string(),
    body: z.string(),
    mediaId,
    mascotMediaId: mediaId.optional(),
    mediaSide: z.enum(["left", "right"]),
  }),
  "gallery-teaser": z.object({
    title: z.string(),
    note: z.string(),
    linkLabel: z.string(),
  }),
  contacts: z.object({
    eyebrow: z.string(),
    title: z.string(),
  }),
  map: z.object({
    title: z.string(),
    routeLabel: z.string(),
  }),
  cta: z.object({
    title: z.string(),
    lead: z.string(),
    nameLabel: z.string(),
    namePlaceholder: z.string(),
    buttonLabel: z.string(),
    mascotMediaId: mediaId.optional(),
  }),
};

export type SiteDocument = z.infer<typeof siteDocumentSchema>;
export type SiteMenu = z.infer<typeof siteMenuSchema>;
export type SiteMenuItem = z.infer<typeof menuItemSchema>;
export type SiteSection = z.infer<typeof siteSectionSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type Venue = z.infer<typeof venueSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
