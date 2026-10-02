import { describe, expect, it } from "vitest";
import { blockTitle, bookingStatusLabels, sectionTypeLabels } from "./labels";
import { moveItem } from "./order";
import { ApiError, errorText } from "./api";

describe("blockTitle", () => {
  it("берёт заголовок из содержимого блока", () => {
    expect(blockTitle({ title: "ГОЛОДНЫМ" })).toBe("ГОЛОДНЫМ");
    expect(blockTitle({ eyebrow: "BAR" })).toBe("BAR");
    expect(blockTitle(null)).toBe("Без названия");
  });
});

describe("подписи", () => {
  it("называет типы блоков и статусы по-русски", () => {
    expect(sectionTypeLabels["dish-row"]).toBe("Еда");
    expect(bookingStatusLabels.no_show).toBe("Не пришли");
  });
});

describe("moveItem", () => {
  it("меняет соседние элементы местами и не выходит за края", () => {
    expect(moveItem(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
  });
});

describe("errorText", () => {
  it("показывает текст ошибки API", () => {
    expect(errorText(new ApiError("Картинка используется", 409))).toBe("Картинка используется");
  });
});
