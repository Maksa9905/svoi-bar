"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useSite } from "@/entities/site";
import { uiStore } from "@/shared/model/ui-store";
import { BookButton } from "@/shared/ui/button/BookButton";
import { NavItems } from "@/entities/site/ui/NavItems";
import styles from "./SiteHeader.module.css";

export const SiteHeader = observer(function SiteHeader() {
  const site = useSite();
  const links = site.data?.header ?? [];

  return (
    <header className={styles.header}>
      <Link href="/" aria-label="СВОИ">
        <img src="/icons/logo-header.svg" alt="" width={38} height={44.396} />
      </Link>
      <NavItems links={links} className={styles.nav} onAction={() => uiStore.openBooking()} />
      <div className={styles.desktopAction}>
        <BookButton size="sm">ЗАБРОНИРОВАТЬ</BookButton>
      </div>
      <button
        type="button"
        className={styles.burger}
        aria-label={uiStore.mobileNavOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={uiStore.mobileNavOpen}
        onClick={() => uiStore.toggleMobileNav()}
      >
        {uiStore.mobileNavOpen ? "×" : "☰"}
      </button>
      {uiStore.mobileNavOpen ? (
        <NavItems
          links={links}
          className={styles.mobile}
          onAction={() => uiStore.openBooking()}
          onNavigate={() => uiStore.closeMobileNav()}
        />
      ) : null}
    </header>
  );
});
