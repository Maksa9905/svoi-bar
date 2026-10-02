import { describe, expect, it } from "vitest";
import { parseCoordinate } from "./coordinate";

describe("parseCoordinate", () => {
  it("принимает дробь с точкой и запятой", () => {
    expect(parseCoordinate("56.326")).toBe(56.326);
    expect(parseCoordinate("44,005")).toBe(44.005);
    expect(parseCoordinate("-12.5")).toBe(-12.5);
  });

  it("отклоняет пустую строку и незаконченный ввод", () => {
    expect(parseCoordinate("")).toBeNull();
    expect(parseCoordinate("56.")).toBeNull();
    expect(parseCoordinate("север")).toBeNull();
  });
});
