import { sectionPayloads } from "@/entities/site";
import { Button } from "@/shared/ui/button/Button";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import shared from "../shared.module.css";
import styles from "./DishRowSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function DishRowSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["dish-row"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const mascot = mediaSrc(site, data.mascotMediaId);

  return (
    <section
      id={section.anchor ?? undefined}
      className={`${shared.section} ${styles.section}`}
    >
      <div className={shared.heading}>
        <div className={shared.stack}>
          <p className={`${shared.eyebrow} ${shared.yellow}`}>{data.eyebrow}</p>
          <h2 className={shared.title}>{data.title}</h2>
        </div>
        <p className={shared.note}>{data.note}</p>
      </div>
      <div className={styles.dishes}>
        {data.dishes.map((dish) => {
          const photo = mediaSrc(site, dish.mediaId);
          return (
            <article key={dish.title} className={styles.dish}>
              {photo ? (
                <CoverImage
                  className={styles.photo}
                  src={photo}
                  alt={dish.alt}
                  sizes="(max-width: 899px) 50vw, 25vw"
                />
              ) : null}
              <h3>{dish.title}</h3>
            </article>
          );
        })}
      </div>
      <div className={styles.footer}>
        <Button href={data.buttonHref} variant="yellow">
          {data.buttonLabel}
        </Button>
        {mascot ? <img className={styles.mascot} src={mascot} alt="" /> : null}
      </div>
    </section>
  );
}
