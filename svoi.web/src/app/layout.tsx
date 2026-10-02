import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Oswald } from "next/font/google";
import { fetchSite, siteQueryKey } from "@/entities/site/api/fetch-site";
import { getQueryClient } from "@/shared/api/query-client";
import { SiteShell } from "./ui/SiteShell";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://svoi.bar"),
  title: {
    default: "СВОИ — кальян-бар в Нижнем Новгороде",
    template: "%s — СВОИ",
  },
  description: "Кальян, бар и еда. Место, где можно просто хорошо провести вечер.",
  openGraph: {
    title: "СВОИ — кальян-бар в Нижнем Новгороде",
    description: "Кальян, бар и еда. Место, где можно просто хорошо провести вечер.",
    locale: "ru_RU",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const siteApiUrl = process.env.API_URL_INTERNAL;
  await queryClient.prefetchQuery({
    queryKey: siteQueryKey,
    queryFn: () => fetchSite(siteApiUrl),
  });

  return (
    <html lang="ru" className={`${oswald.variable} ${manrope.variable}`}>
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SiteShell>{children}</SiteShell>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
