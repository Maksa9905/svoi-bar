import { describe, expect, it } from "vitest";
import { formatPositionCount } from "./plural";

describe("formatPositionCount", () => {
  it("склоняет подпись количества позиций", () => {
    expect(formatPositionCount(1)).toBe("01 ПОЗИЦИЯ");
    expect(formatPositionCount(4)).toBe("04 ПОЗИЦИИ");
    expect(formatPositionCount(12)).toBe("12 ПОЗИЦИЙ");
  });
});
