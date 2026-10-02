import { sectionPayloads } from "@/entities/site";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import shared from "../shared.module.css";
import styles from "./MediaBandSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function MediaBandSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["media-band"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const photo = mediaSrc(site, data.mediaId);

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      <div className={shared.heading}>
        <div className={shared.stack}>
          <p className={`${shared.eyebrow} ${shared.pink}`}>{data.eyebrow}</p>
          <h2 className={shared.title}>{data.title}</h2>
        </div>
        <p className={shared.note}>{data.note}</p>
      </div>
      {photo ? <CoverImage className={styles.shot} src={photo} alt="" sizes="100vw" /> : null}
      <div className={styles.drinks}>
        {data.labels.map((label) => (
          <div key={label.title} className={styles.label}>
            <h3 className={label.accent ? styles.featured : undefined}>{label.title}</h3>
            {label.price ? <span>{label.price}</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
