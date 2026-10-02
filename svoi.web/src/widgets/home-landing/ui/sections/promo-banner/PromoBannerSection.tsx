import { sectionPayloads } from "@/entities/site";
import { BookButton } from "@/shared/ui/button/BookButton";
import shared from "../shared.module.css";
import styles from "./PromoBannerSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function PromoBannerSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["promo-banner"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const photo = mediaSrc(site, data.mediaId);

  return (
    <section
      id={section.anchor ?? undefined}
      className={`${shared.section} ${styles.section}`}
      style={{ background: data.background }}
    >
      <div className={shared.stack}>
        <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
        <div className={styles.schedule}>
          <p>{data.schedule}</p>
          <p className={styles.days}>{data.days}</p>
        </div>
        <BookButton variant="dark">{data.buttonLabel}</BookButton>
      </div>
      {photo ? <img className={styles.image} src={photo} alt="" width={330} height={360} /> : null}
    </section>
  );
}
