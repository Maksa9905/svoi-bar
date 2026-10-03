import { MenuPage } from "@/views/menu";
import { breadcrumbJsonLd, pageMetadata } from "@/shared/config/seo";
import { JsonLd } from "../ui/JsonLd";

export const metadata = pageMetadata({
  title: "Меню",
  description: "Кальян, закуски, горячее и бар. Выбирай, что сегодня будем.",
  path: "/menu",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "СВОИ", path: "/" },
          { name: "Меню", path: "/menu" },
        ])}
      />
      <MenuPage />
    </>
  );
}
