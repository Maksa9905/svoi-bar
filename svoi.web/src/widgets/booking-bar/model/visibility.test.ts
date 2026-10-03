import { describe, expect, it } from "vitest";
import { bookingBarVisible } from "./visibility";

describe("bookingBarVisible", () => {
  it("показывает кнопку, если hero нет", () => {
    expect(bookingBarVisible(null)).toBe(true);
  });

  it("прячет кнопку, пока hero ещё на экране", () => {
    expect(bookingBarVisible(640)).toBe(false);
    expect(bookingBarVisible(1)).toBe(false);
  });

  it("показывает кнопку, когда hero ушёл вверх", () => {
    expect(bookingBarVisible(0)).toBe(true);
    expect(bookingBarVisible(-20)).toBe(true);
  });
});
