import { sectionPayloads } from "@/entities/site";
import { BookButton } from "@/shared/ui/button/BookButton";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import shared from "../shared.module.css";
import styles from "./FeaturePriceSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function FeaturePriceSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["feature-price"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const photo = mediaSrc(site, data.mediaId);

  return (
    <section id={section.anchor ?? undefined} className={styles.section}>
      {photo ? (
        <CoverImage
          className={styles.photo}
          src={photo}
          alt=""
          sizes="(max-width: 899px) 100vw, 55vw"
        />
      ) : null}
      <div className={styles.copy}>
        <div className={shared.stack}>
          <p className={`${shared.eyebrow} ${shared.lime}`}>{data.eyebrow}</p>
          <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
          <p className={shared.lead}>{data.lead}</p>
          <p className={styles.price}>{data.price}</p>
          <BookButton>{data.buttonLabel}</BookButton>
        </div>
        <p className={styles.footnote}>{data.footnote}</p>
      </div>
    </section>
  );
}
