export const sectionTypeLabels: Record<string, string> = {
  hero: "Первый экран",
  "text-media": "Текст и фото",
  "icon-cards": "Чем заняться",
  "feature-price": "Кальян и цена",
  "promo-banner": "Акция",
  "media-band": "Бар",
  "dish-row": "Еда",
  split: "Текст и фото с персонажем",
  "gallery-teaser": "Галерея на главной",
  contacts: "Контакты",
  map: "Карта",
  cta: "Призыв забронировать",
};

export const bookingStatusLabels: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  cancelled: "Отменена",
  no_show: "Не пришли",
};

export const brandColors = [
  { value: "#B7E637", label: "Лайм" },
  { value: "#F4C531", label: "Жёлтый" },
  { value: "#F0529D", label: "Розовый" },
  { value: "#9B63E8", label: "Фиолетовый" },
  { value: "#D94A3A", label: "Красный" },
];

export function blockTitle(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Без названия";
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.title === "string" && record.title) {
    return record.title;
  }
  if (typeof record.eyebrow === "string" && record.eyebrow) {
    return record.eyebrow;
  }
  return "Без названия";
}
