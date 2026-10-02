import { sectionPayloads } from "@/entities/site";
import { Button } from "@/shared/ui/button/Button";
import shared from "../shared.module.css";
import styles from "./ContactsSection.module.css";
import type { SectionProps } from "../types";

export function ContactsSection({ site, section }: SectionProps) {
  const payload = sectionPayloads.contacts.safeParse(section.payload);
  if (!payload.success || !site.venue) {
    return null;
  }

  const data = payload.data;
  const venue = site.venue;

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      <div className={shared.stack}>
        <p className={`${shared.eyebrow} ${shared.red}`}>{data.eyebrow}</p>
        <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
        <p className={styles.city}>{venue.city}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.detail}>
          <span>АДРЕС</span>
          {venue.address}
        </p>
        <p className={styles.detail}>
          <span>ТЕЛЕФОН</span>
          {venue.phone}
        </p>
        <p className={styles.detail}>
          <span>ЧАСЫ РАБОТЫ</span>
          {venue.hours}
        </p>
        <div className={styles.actions}>
          <Button href="#map">ПОКАЗАТЬ НА КАРТЕ</Button>
          <Button href={`tel:${venue.phone}`} variant="secondary">
            ПОЗВОНИТЬ
          </Button>
        </div>
      </div>
    </section>
  );
}
