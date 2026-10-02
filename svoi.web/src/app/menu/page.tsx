import type { Metadata } from "next";
import { MenuPage } from "@/views/menu";

export const metadata: Metadata = {
  title: "Меню",
  description: "Кальян, закуски, горячее и бар. Выбирай, что сегодня будем.",
};

export default function Page() {
  return <MenuPage />;
}
