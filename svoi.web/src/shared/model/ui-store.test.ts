import { describe, expect, it, beforeEach } from "vitest";
import { uiStore } from "./ui-store";

describe("uiStore", () => {
  beforeEach(() => {
    uiStore.reset();
  });

  it("открывает и закрывает бронирование", () => {
    uiStore.openBooking();
    expect(uiStore.bookingOpen).toBe(true);
    uiStore.completeBooking("SV-2048");
    expect(uiStore.bookingRequestId).toBe("SV-2048");
    uiStore.closeBooking();
    expect(uiStore.bookingOpen).toBe(false);
    expect(uiStore.bookingRequestId).toBeNull();
  });

  it("листает лайтбокс по кругу", () => {
    uiStore.openLightbox(0);
    uiStore.stepLightbox(-1, 4);
    expect(uiStore.lightboxIndex).toBe(3);
  });
});
