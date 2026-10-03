import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Oswald } from "next/font/google";
import { fetchSite, siteQueryKey } from "@/entities/site/api/fetch-site";
import { getQueryClient } from "@/shared/api/query-client";
import { rootMetadata, venueJsonLd, viewportTheme, vkImageUrl } from "@/shared/config/seo";
import { SiteShell } from "./ui/SiteShell";
import { JsonLd } from "./ui/JsonLd";
import { Providers } from "./providers/Providers";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700", "800"],
  variable: "--font-body",
});

export const metadata = rootMetadata;

export const viewport: Viewport = viewportTheme;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const siteApiUrl = process.env.API_URL_INTERNAL;
  const site = await queryClient.fetchQuery({
    queryKey: siteQueryKey,
    queryFn: () => fetchSite(siteApiUrl),
  });

  return (
    <html lang="ru" className={`${oswald.variable} ${manrope.variable}`}>
      <body>
        <meta property="vk:image" content={vkImageUrl} />
        <JsonLd data={venueJsonLd(site.venue)} />
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SiteShell>{children}</SiteShell>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
