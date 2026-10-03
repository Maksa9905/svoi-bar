import { GalleryPage } from "@/views/gallery";
import { breadcrumbJsonLd, pageMetadata } from "@/shared/config/seo";
import { JsonLd } from "../ui/JsonLd";

export const metadata = pageMetadata({
  title: "Галерея",
  description: "Дым, музыка, тёплый свет и люди, которые остаются ещё на один раунд.",
  path: "/gallery",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "СВОИ", path: "/" },
          { name: "Галерея", path: "/gallery" },
        ])}
      />
      <GalleryPage />
    </>
  );
}
