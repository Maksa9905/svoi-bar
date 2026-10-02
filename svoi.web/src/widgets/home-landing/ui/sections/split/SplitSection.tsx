import { sectionPayloads } from "@/entities/site";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import shared from "../shared.module.css";
import styles from "./SplitSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function SplitSection({ site, section }: SectionProps) {
  const payload = sectionPayloads.split.safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const photo = mediaSrc(site, data.mediaId);
  const mascot = mediaSrc(site, data.mascotMediaId);
  const copy = (
    <div className={styles.copy}>
      <div className={shared.stack}>
        <p className={shared.eyebrow} style={{ color: data.eyebrowColor }}>
          {data.eyebrow}
        </p>
        <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
        <p className={shared.muted}>{data.body}</p>
      </div>
      {mascot ? <img className={styles.mascot} src={mascot} alt="" width={360} height={380} /> : null}
    </div>
  );
  const image = photo ? (
    <CoverImage
      className={styles.photo}
      src={photo}
      alt=""
      sizes="(max-width: 899px) 100vw, 60vw"
    />
  ) : null;

  return (
    <section id={section.anchor ?? undefined} className={styles.section}>
      {data.mediaSide === "left" ? image : null}
      {copy}
      {data.mediaSide === "right" ? image : null}
    </section>
  );
}
