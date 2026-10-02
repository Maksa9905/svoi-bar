import type { ReactNode } from "react";
import { BookingModal } from "@/features/book-table";
import { BookingBar } from "@/widgets/booking-bar";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./SiteShell.module.css";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.frame}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
      <BookingBar />
      <BookingModal />
    </>
  );
}
