export type MediaAsset = {
  id: string;
  alt: string;
  mimeType: string;
  url: string;
};

export type Section = {
  id: string;
  type: string;
  anchor: string | null;
  sortOrder: number;
  payload: Record<string, unknown>;
};

export type Booking = {
  id: string;
  requestId: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  name: string | null;
  comment: string | null;
  status: string;
  createdAt: string;
};

export type MenuFilter = { id: string; slug: string; label: string; sortOrder: number };
export type MenuGroup = { id: string; title: string; sortOrder: number };
export type MenuItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  accent: string;
  alt: string;
  sortOrder: number;
  filter: { id: string; slug: string; label: string };
  group: { id: string; title: string };
  media: MediaAsset;
};

export type GalleryItem = {
  id: string;
  caption: string;
  alt: string;
  height: number;
  sortOrder: number;
  showOnHome: boolean;
  homeSortOrder: number | null;
  mascotSide: string | null;
  media: MediaAsset;
  mascot: MediaAsset | null;
};

export type NavLink = {
  id: string;
  label: string;
  sortOrder: number;
  target:
    | { type: "page"; path: string | null }
    | { type: "action"; action: string | null }
    | { type: "section"; sectionId: string; anchor: string; href: string }
    | { type: "broken"; sectionId: string | null };
};

export type Venue = {
  name: string;
  city: string;
  descriptor: string;
  phone: string;
  address: string;
  hours: string;
  lat: number;
  lon: number;
  legal: string;
};
