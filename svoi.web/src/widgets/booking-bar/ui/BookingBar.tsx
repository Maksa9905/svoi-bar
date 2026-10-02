import { BookButton } from "@/shared/ui/button/BookButton";
import styles from "./BookingBar.module.css";

export function BookingBar() {
  return (
    <div className={styles.bar}>
      <BookButton full>ЗАБРОНИРОВАТЬ СТОЛ</BookButton>
    </div>
  );
}
