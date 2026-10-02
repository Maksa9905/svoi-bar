import { sectionPayloads } from "@/entities/site";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import shared from "../shared.module.css";
import styles from "./TextMediaSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function TextMediaSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["text-media"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const photo = mediaSrc(site, data.mediaId);
  const copy = (
    <div className={shared.stack}>
      <p className={shared.eyebrow} style={{ color: data.eyebrowColor }}>
        {data.eyebrow}
      </p>
      <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
      <p className={shared.muted}>{data.body}</p>
    </div>
  );
  const image = photo ? (
    <CoverImage src={photo} alt="" height={520} sizes="(max-width: 899px) 100vw, 50vw" />
  ) : null;

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      {data.mediaSide === "left" ? image : null}
      {copy}
      {data.mediaSide === "right" ? image : null}
    </section>
  );
}
