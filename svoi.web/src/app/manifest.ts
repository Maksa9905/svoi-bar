import type { MetadataRoute } from "next";
import { siteDescription, siteName, siteUrl } from "@/shared/config/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: siteUrl,
    name: "СВОИ — кальян-бар",
    short_name: siteName,
    description: siteDescription,
    lang: "ru",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Меню", url: "/menu", description: "Кальян, закуски, горячее и бар" },
      { name: "Галерея", url: "/gallery", description: "Фотографии бара" },
    ],
  };
}
