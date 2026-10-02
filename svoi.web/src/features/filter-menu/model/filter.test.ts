import { describe, expect, it } from "vitest";
import type { SiteMenu } from "@/entities/site";
import { filterMenu } from "./filter";

const menu: SiteMenu = {
  filters: [
    { id: "f-hookah", slug: "hookah", label: "КАЛЬЯН", sortOrder: 0 },
    { id: "f-snacks", slug: "snacks", label: "ЗАКУСКИ", sortOrder: 1 },
  ],
  groups: [
    { id: "g1", title: "КАЛЬЯН И ЗАКУСКИ", sortOrder: 0 },
    { id: "g2", title: "СЫТНОЕ", sortOrder: 1 },
  ],
  items: [
    item("classic", "hookah", "КАЛЬЯН", "g1", "КАЛЬЯН И ЗАКУСКИ", 0),
    item("nachos", "snacks", "ЗАКУСКИ", "g1", "КАЛЬЯН И ЗАКУСКИ", 1),
    item("set", "sets", "СЕТЫ", "g2", "СЫТНОЕ", 0),
  ],
};

function item(
  id: string,
  slug: string,
  label: string,
  groupId: string,
  groupTitle: string,
  sortOrder: number,
): SiteMenu["items"][number] {
  return {
    id,
    title: id,
    description: "",
    price: "100",
    accent: "#fff",
    alt: "",
    sortOrder,
    filter: { id: slug, slug, label },
    group: { id: groupId, title: groupTitle },
    media: { id: "m", alt: "", mimeType: "image/png", url: "/images/x.png" },
  };
}

describe("filterMenu", () => {
  it("оставляет группы, в которых есть позиции", () => {
    expect(filterMenu(menu, "all").map((group) => group.title)).toEqual([
      "КАЛЬЯН И ЗАКУСКИ",
      "СЫТНОЕ",
    ]);
  });

  it("показывает только кальян", () => {
    const [section] = filterMenu(menu, "hookah");
    expect(section?.items.map((entry) => entry.id)).toEqual(["classic"]);
  });
});
