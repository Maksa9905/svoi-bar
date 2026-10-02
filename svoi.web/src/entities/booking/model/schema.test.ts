import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "./schema";

const validBooking = {
  guests: 4,
  date: "2026-10-12",
  time: "20:30",
  phone: "+7 900 123 45 67",
  name: "Аня",
};

describe("bookingRequestSchema", () => {
  it("принимает заявку из формы бронирования", () => {
    const parsed = bookingRequestSchema.parse(validBooking);
    expect(parsed.phone).toBe("+79001234567");
    expect(parsed.guests).toBe(4);
  });

  it("отклоняет неполный телефон", () => {
    const result = bookingRequestSchema.safeParse({ ...validBooking, phone: "+7 900" });
    expect(result.success).toBe(false);
  });
});
