import { sectionPayloads } from "@/entities/site";
import shared from "../shared.module.css";
import styles from "./IconCardsSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function IconCardsSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["icon-cards"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      <div className={shared.heading}>
        <h2 className={shared.title}>{data.title}</h2>
        <p className={shared.note}>{data.note}</p>
      </div>
      <div className={styles.cards}>
        {data.cards.map((card) => (
          <article key={card.title} className={styles.card}>
            <span className={styles.icon} style={{ background: card.color }}>
              <img src={mediaSrc(site, card.iconMediaId)} alt="" width={20} height={20} />
            </span>
            <div className={shared.stack}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
