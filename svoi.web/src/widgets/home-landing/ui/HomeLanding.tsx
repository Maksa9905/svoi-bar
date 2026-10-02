"use client";

import { useSite } from "@/entities/site";
import shared from "./sections/shared.module.css";
import { SectionView } from "./sections/SectionView";

export function HomeLanding() {
  const site = useSite();

  if (site.isPending) {
    return <p className={shared.lead}>Загружаем сайт...</p>;
  }

  if (site.isError || !site.data) {
    return <p className={shared.lead}>Не удалось загрузить содержимое сайта.</p>;
  }

  return (
    <>
      {site.data.sections.map((section) => (
        <SectionView key={section.id} site={site.data} section={section} />
      ))}
    </>
  );
}
