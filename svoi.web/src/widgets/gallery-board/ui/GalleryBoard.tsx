"use client";

import { observer } from "mobx-react-lite";
import { useSite, type GalleryItem } from "@/entities/site";
import { Lightbox, type LightboxPhoto } from "@/features/gallery-lightbox";
import { resolveAssetUrl } from "@/shared/config/api";
import { uiStore } from "@/shared/model/ui-store";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import styles from "./GalleryBoard.module.css";

function toColumns(items: GalleryItem[], columnCount: number): GalleryItem[][] {
  const size = Math.max(1, Math.ceil(items.length / columnCount));
  return Array.from({ length: columnCount }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  ).filter((column) => column.length > 0);
}

export const GalleryBoard = observer(function GalleryBoard() {
  const site = useSite();
  const items = site.data?.gallery.items ?? [];
  const columns = toColumns(items, 4);
  const photos: LightboxPhoto[] = items.map((item) => ({
    id: item.id,
    src: resolveAssetUrl(item.media.url),
    alt: item.alt,
    caption: item.caption,
  }));

  return (
    <>
      <section className={styles.intro}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.eyebrow}>
              {site.data?.venue ? `СВОИ · ${site.data.venue.city.toUpperCase()}` : "СВОИ"}
            </p>
            <h1>ГАЛЕРЕЯ</h1>
          </div>
          <div>
            <p className={styles.note}>Лучше один раз увидеть.</p>
            <p className={styles.stars}>✦ ✷ ✦ ✷</p>
          </div>
        </div>
        <p className={styles.caption}>
          Дым, музыка, тёплый свет и люди, которые остаются ещё на один раунд.
        </p>
      </section>

      {site.isPending ? <p className={styles.status}>Открываем галерею...</p> : null}
      {site.isError ? <p className={styles.status}>Галерея сейчас не загрузилась.</p> : null}

      <section className={styles.grid}>
        <div className={styles.masonry}>
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={styles.column}>
              {column.map((photo) => {
                const index = photos.findIndex((item) => item.id === photo.id);
                const side = photo.mascotSide === "left" || photo.mascotSide === "right" || photo.mascotSide === "top"
                  ? photo.mascotSide
                  : null;
                return (
                  <div
                    key={photo.id}
                    className={styles.shot}
                    style={{ ["--photo-h" as string]: `${photo.height}px` }}
                  >
                    <button type="button" onClick={() => uiStore.openLightbox(index)}>
                      <CoverImage
                        className={styles.photo}
                        src={resolveAssetUrl(photo.media.url)}
                        alt={photo.alt}
                        sizes="(max-width: 1099px) 50vw, 25vw"
                      />
                    </button>
                    {photo.mascot && side ? (
                      <img
                        className={`${styles.mascot} ${styles[side]}`}
                        src={resolveAssetUrl(photo.mascot.url)}
                        alt={photo.mascot.alt}
                        width={112}
                        height={168}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.ending}>
          <p className={styles.endingStars}>✦ ✷ ✦ ✷</p>
          <p className={styles.closing}>Лучше один раз увидеть.</p>
        </div>
      </section>
      <Lightbox photos={photos} />
    </>
  );
});
