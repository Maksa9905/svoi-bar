import Link from "next/link";
import { sectionPayloads } from "@/entities/site";
import { resolveAssetUrl } from "@/shared/config/api";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import shared from "../shared.module.css";
import styles from "./GalleryTeaserSection.module.css";
import type { SectionProps } from "../types";

function chunk<T>(items: T[], size: number): T[][] {
  const columns: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    columns.push(items.slice(index, index + size));
  }
  return columns;
}

export function GalleryTeaserSection({ site, section }: SectionProps) {
  const payload = sectionPayloads["gallery-teaser"].safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const columns = chunk(site.gallery.home, 2);

  return (
    <section id={section.anchor ?? undefined} className={`${shared.section} ${styles.section}`}>
      <div className={shared.heading}>
        <h2 className={shared.title}>{data.title}</h2>
        <p className={shared.note}>{data.note}</p>
      </div>
      <div className={styles.mosaic}>
        {columns.map((column) => (
          <div key={column[0]?.id} className={styles.column}>
            {column.map((photo) => (
              <CoverImage
                key={photo.id}
                src={resolveAssetUrl(photo.media.url)}
                alt={photo.alt}
                height={photo.height}
                sizes="(max-width: 899px) 100vw, 30vw"
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.foot}>
        <Link className={styles.link} href="/gallery">
          {data.linkLabel}
        </Link>
      </div>
    </section>
  );
}
