import type { Metadata } from "next";

export const siteUrl = "https://svoi.hakolr.dev";
export const siteName = "СВОИ";
export const siteTitle = "СВОИ — кальян-бар в Нижнем Новгороде";
export const siteDescription =
  "Кальян, бар и еда. Место, где можно просто хорошо провести вечер.";

const ogImage = {
  url: "/brand/og.png",
  secureUrl: `${siteUrl}/brand/og.png`,
  width: 1200,
  height: 630,
  alt: siteTitle,
  type: "image/png",
} as const;

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "кальян-бар",
  classification: "Кальян-бар",
  keywords: [
    "СВОИ",
    "кальян-бар",
    "кальян",
    "бар",
    "Нижний Новгород",
    "меню",
    "бронирование стола",
  ],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/brand/safari-pinned.svg", color: "#090909" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    date: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  other: {
    "geo.region": "RU-NIZ",
    "geo.placename": "Нижний Новгород",
  },
};

export const viewportTheme = {
  themeColor: "#090909",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
} as const;

export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const absoluteTitle = title ? `${title} — ${siteName}` : siteTitle;
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;

  return {
    title: title ?? { absolute: siteTitle },
    description,
    alternates: {
      canonical: path,
      languages: { "ru-RU": path },
    },
    openGraph: {
      title: absoluteTitle,
      description,
      url,
      images: [ogImage],
    },
    twitter: {
      title: absoluteTitle,
      description,
      images: [{ ...ogImage, alt: absoluteTitle }],
    },
  };
}

const placeholder = /\[[^\]]+\]/;

export function publishedText(value: string | null | undefined): string | undefined {
  const text = value?.trim();
  if (!text || placeholder.test(text)) {
    return undefined;
  }

  return text;
}

type VenueSeo = {
  name: string;
  city: string;
  descriptor: string;
  phone: string;
  address: string;
  lat: number;
  lon: number;
};

export function venueJsonLd(venue: VenueSeo | null) {
  const phone = publishedText(venue?.phone);
  const street = publishedText(venue?.address);
  const city = publishedText(venue?.city) ?? "Нижний Новгород";
  const name = publishedText(venue?.name) ?? siteName;
  const slogan = publishedText(venue?.descriptor);

  const place: Record<string, unknown> = {
    "@type": "BarOrPub",
    "@id": `${siteUrl}/#venue`,
    name,
    description: siteDescription,
    url: siteUrl,
    image: `${siteUrl}/brand/og.png`,
    logo: `${siteUrl}/brand/icon-512.png`,
    hasMenu: `${siteUrl}/menu`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "RU",
      ...(street ? { streetAddress: street } : {}),
    },
    ...(slogan ? { slogan } : {}),
    ...(phone ? { telephone: phone } : {}),
  };

  if (venue && Number.isFinite(venue.lat) && Number.isFinite(venue.lon)) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: venue.lat,
      longitude: venue.lon,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "ru-RU",
        publisher: { "@id": `${siteUrl}/#venue` },
      },
      place,
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? siteUrl : `${siteUrl}${item.path}`,
    })),
  };
}
