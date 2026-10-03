import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/config/seo";

const paths = ["/", "/menu", "/gallery"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.map((path) => {
    const url = path === "/" ? siteUrl : `${siteUrl}${path}`;

    return {
      url,
      lastModified,
      changeFrequency: "weekly",
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: { "ru-RU": url },
      },
    };
  });
}
