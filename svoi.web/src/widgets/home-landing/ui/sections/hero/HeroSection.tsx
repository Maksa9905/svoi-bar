import Image from "next/image";
import { sectionPayloads } from "@/entities/site";
import { BookButton } from "@/shared/ui/button/BookButton";
import { Button } from "@/shared/ui/button/Button";
import shared from "../shared.module.css";
import styles from "./HeroSection.module.css";
import { mediaSrc, type SectionProps } from "../types";

export function HeroSection({ site, section }: SectionProps) {
  const payload = sectionPayloads.hero.safeParse(section.payload);
  if (!payload.success) {
    return null;
  }

  const data = payload.data;
  const desktop = mediaSrc(site, data.backgroundDesktopMediaId);
  const mobile = mediaSrc(site, data.backgroundMobileMediaId);
  const mascot = mediaSrc(site, data.mascotMediaId);

  return (
    <section className={styles.hero}>
      {mobile ? (
        <div className={`${styles.media} ${styles.mobileOnly}`}>
          <Image
            src={mobile}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>
      ) : null}
      {desktop ? (
        <div className={`${styles.media} ${styles.desktopOnly}`}>
          <Image
            src={desktop}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>
      ) : null}
      <div className={styles.scrim} />
      <div className={styles.content}>
        <p className={`${shared.eyebrow} ${shared.lime}`}>{data.eyebrow}</p>
        <p className={`${styles.stars} ${styles.desktopOnly}`}>✦ ✷ ✦ ✷</p>
        <img
          className={styles.mobileOnly}
          src="/icons/logo-mobile.svg"
          alt="СВОИ"
          width={112}
          height={130.851}
        />
        <img
          className={styles.desktopOnly}
          src="/icons/logo-hero.svg"
          alt="СВОИ"
          width={154}
          height={231}
        />
        <p className={styles.kicker}>{data.kicker}</p>
        <p className={shared.lead}>{data.lead}</p>
        <div className={styles.actions}>
          <BookButton>{data.primaryLabel}</BookButton>
          <Button href={data.secondaryHref} variant="secondary">
            {data.secondaryLabel}
          </Button>
        </div>
      </div>
      {mascot ? (
        <img className={styles.mascot} src={mascot} alt="" width={180} height={260} />
      ) : null}
    </section>
  );
}
