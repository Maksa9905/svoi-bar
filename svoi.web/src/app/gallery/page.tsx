import type { Metadata } from "next";
import { GalleryPage } from "@/views/gallery";

export const metadata: Metadata = {
  title: "Галерея",
  description: "Дым, музыка, тёплый свет и люди, которые остаются ещё на один раунд.",
};

export default function Page() {
  return <GalleryPage />;
}
