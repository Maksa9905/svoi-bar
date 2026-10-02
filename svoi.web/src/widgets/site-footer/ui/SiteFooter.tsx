"use client";

import { useSite } from "@/entities/site";
import { NavItems } from "@/entities/site/ui/NavItems";
import { uiStore } from "@/shared/model/ui-store";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const site = useSite();
  const venue = site.data?.venue;

  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.brand}>
          <img src="/icons/logo-footer.svg" alt={venue?.name ?? "СВОИ"} width={72} height={84.1188} />
          <p className={styles.descriptor}>{venue?.descriptor ?? "Кальян · Бар · Еда"}</p>
        </div>
        <NavItems
          links={site.data?.footer ?? []}
          className={styles.links}
          linkClassName={styles.buttonLink}
          onAction={() => uiStore.openBooking()}
        />
        <div className={styles.contacts}>
          <p className={styles.city}>{venue?.city.toUpperCase()}</p>
          <p className={styles.meta}>{venue?.address}</p>
          <p className={styles.meta}>{venue?.phone}</p>
        </div>
      </div>
      <p className={styles.legal}>{venue?.legal}</p>
    </footer>
  );
}
