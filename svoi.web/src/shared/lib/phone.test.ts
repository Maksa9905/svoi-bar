import { describe, expect, it } from "vitest";
import { formatPhone, isCompletePhone, normalizePhone } from "./phone";

describe("phone", () => {
  it("нормализует российский номер", () => {
    expect(normalizePhone("8 (900) 123-45-67")).toBe("+79001234567");
    expect(isCompletePhone("+7 900 123 45 67")).toBe(true);
  });

  it("форматирует номер по маске макета", () => {
    expect(formatPhone("79001234567")).toBe("+7 900 123 45 67");
    expect(isCompletePhone("+7")).toBe(false);
  });
});
