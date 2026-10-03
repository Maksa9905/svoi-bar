"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookButton } from "@/shared/ui/button/BookButton";
import { bookingBarVisible } from "../model/visibility";
import styles from "./BookingBar.module.css";

export function BookingBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(pathname !== "/");

  useEffect(() => {
    let current: Element | null | undefined;
    let observer: IntersectionObserver | null = null;

    const attach = () => {
      const hero = document.querySelector("[data-hero]");
      if (hero === current) {
        return;
      }

      observer?.disconnect();
      observer = null;
      current = hero;

      if (!hero) {
        setVisible(true);
        return;
      }

      observer = new IntersectionObserver(([entry]) => {
        setVisible(bookingBarVisible(entry?.boundingClientRect.bottom ?? null));
      });
      observer.observe(hero);
    };

    attach();
    const main = document.querySelector("main");
    const mutations = new MutationObserver(attach);
    if (main) {
      mutations.observe(main, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return (
    <div className={visible ? `${styles.bar} ${styles.visible}` : styles.bar}>
      <BookButton full>ЗАБРОНИРОВАТЬ СТОЛ</BookButton>
    </div>
  );
}
