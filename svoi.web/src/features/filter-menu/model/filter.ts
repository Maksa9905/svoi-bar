import type { SiteMenu, SiteMenuItem } from "@/entities/site";

export type MenuSectionView = {
  id: string;
  title: string;
  items: SiteMenuItem[];
};

export function filterMenu(menu: SiteMenu, category: string): MenuSectionView[] {
  const matched =
    category === "all" ? menu.items : menu.items.filter((item) => item.filter.slug === category);

  return menu.groups
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((group) => ({
      id: group.id,
      title: group.title,
      items: matched
        .filter((item) => item.group.id === group.id)
        .sort((left, right) => left.sortOrder - right.sortOrder),
    }))
    .filter((group) => group.items.length > 0);
}
