import { sectionPayloads } from "@/entities/site";
import { BookButton } from "@/shared/ui/button/BookButton";
import shared from "../shared.module.css";
import styles from "./CtaSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function CtaSection({ site, section }: SectionProps) {
  const payload = sectionPayloads.cta.safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const mascot = mediaSrc(site, data.mascotMediaId);

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      <div className={shared.stack}>
        <h2 className={`${shared.title} ${styles.title}`}>{data.title}</h2>
        <p className={styles.stars}>✦ ✷ ✦ ✷</p>
        <p className={styles.lead}>{data.lead}</p>
        <BookButton variant="dark">{data.buttonLabel}</BookButton>
      </div>
      <div className={styles.art}>
        {mascot ? (
          <img className={styles.mascot} src={mascot} alt="" width={360} height={420} />
        ) : null}
      </div>
    </section>
  );
}
