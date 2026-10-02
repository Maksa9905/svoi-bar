import { makeAutoObservable } from "mobx";

class UiStore {
  bookingOpen = false;
  mobileNavOpen = false;
  lightboxIndex: number | null = null;
  menuCategory = "all";
  bookingRequestId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openBooking(): void {
    this.bookingRequestId = null;
    this.bookingOpen = true;
    this.mobileNavOpen = false;
  }

  closeBooking(): void {
    this.bookingOpen = false;
    this.bookingRequestId = null;
  }

  completeBooking(requestId: string): void {
    this.bookingRequestId = requestId;
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  closeMobileNav(): void {
    this.mobileNavOpen = false;
  }

  setMenuCategory(category: string): void {
    this.menuCategory = category;
  }

  openLightbox(index: number): void {
    this.lightboxIndex = index;
  }

  closeLightbox(): void {
    this.lightboxIndex = null;
  }

  stepLightbox(delta: number, total: number): void {
    if (this.lightboxIndex === null || total === 0) {
      return;
    }

    this.lightboxIndex = (this.lightboxIndex + delta + total) % total;
  }

  reset(): void {
    this.bookingOpen = false;
    this.mobileNavOpen = false;
    this.lightboxIndex = null;
    this.menuCategory = "all";
    this.bookingRequestId = null;
  }
}

export const uiStore = new UiStore();
