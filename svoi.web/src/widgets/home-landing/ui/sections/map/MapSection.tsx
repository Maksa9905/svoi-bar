import { sectionPayloads } from "@/entities/site";
import shared from "../shared.module.css";
import styles from "./MapSection.module.css";
import type { SectionProps } from "../types";

export function MapSection({ site, section }: SectionProps) {
  const payload = sectionPayloads.map.safeParse(section.payload);
  if (!payload.success || !site.venue) {
    return null;
  }

  const data = payload.data;
  const { lat, lon } = site.venue;
  const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon},${lat},pm2rdm`;

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      <div className={shared.stack}>
        <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
        <a className={styles.route} href={mapSrc} target="_blank" rel="noreferrer">
          {data.routeLabel}
        </a>
      </div>
      <div className={styles.frame}>
        <iframe title={data.title} src={mapSrc} />
      </div>
    </section>
  );
}
