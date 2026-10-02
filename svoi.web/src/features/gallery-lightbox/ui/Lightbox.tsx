"use client";

import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { uiStore } from "@/shared/model/ui-store";
import styles from "./Lightbox.module.css";

export type LightboxPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export const Lightbox = observer(function Lightbox({ photos }: { photos: LightboxPhoto[] }) {
  const startX = useRef<number | null>(null);
  const index = uiStore.lightboxIndex;
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    if (index === null) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        uiStore.closeLightbox();
      }
      if (event.key === "ArrowRight") {
        uiStore.stepLightbox(1, photos.length);
      }
      if (event.key === "ArrowLeft") {
        uiStore.stepLightbox(-1, photos.length);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length]);

  if (!photo || index === null) {
    return null;
  }

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

  return (
    <div className={styles.scrim} data-overlay="open" onClick={() => uiStore.closeLightbox()}>
      <div
        className={styles.viewer}
        role="dialog"
        aria-modal="true"
        aria-label={photo.caption}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          startX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (startX.current === null) {
            return;
          }
          const delta = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
          if (Math.abs(delta) > 40) {
            uiStore.stepLightbox(delta < 0 ? 1 : -1, photos.length);
          }
          startX.current = null;
        }}
      >
        <div className={styles.bar}>
          <p className={styles.counter}>{counter}</p>
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть"
            onClick={() => uiStore.closeLightbox()}
          >
            ×
          </button>
        </div>
        <div className={styles.frame}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 899px) 100vw, 920px"
            className={styles.image}
          />
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            aria-label="Предыдущее фото"
            onClick={() => uiStore.stepLightbox(-1, photos.length)}
          >
            ←
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            aria-label="Следующее фото"
            onClick={() => uiStore.stepLightbox(1, photos.length)}
          >
            →
          </button>
        </div>
        <div>
          <p className={styles.caption}>{photo.caption}</p>
          <p className={styles.hint}>СВАЙП ИЛИ ИСПОЛЬЗУЙТЕ СТРЕЛКИ</p>
        </div>
      </div>
    </div>
  );
});
