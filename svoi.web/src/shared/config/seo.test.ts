import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, publishedText, venueJsonLd } from "./seo";

const placeholderVenue = {
  name: "СВОИ",
  city: "Нижний Новгород",
  descriptor: "Кальян · Бар · Еда",
  phone: "[ТЕЛЕФОН]",
  address: "[АДРЕС]",
  lat: 56.326887,
  lon: 44.005986,
};

describe("seo", () => {
  it("считает плейсхолдеры в квадратных скобках пустыми", () => {
    expect(publishedText("[ТЕЛЕФОН]")).toBeUndefined();
    expect(publishedText("  ")).toBeUndefined();
    expect(publishedText("+7 900 000-00-00")).toBe("+7 900 000-00-00");
  });

  it("не кладёт плейсхолдеры контактов в схему заведения", () => {
    const graph = venueJsonLd(placeholderVenue)["@graph"];
    const place = graph[1] as {
      telephone?: string;
      openingHours?: string;
      address: { streetAddress?: string; addressLocality: string };
      geo: { latitude: number };
    };

    expect(place.telephone).toBeUndefined();
    expect(place.openingHours).toBeUndefined();
    expect(place.address.streetAddress).toBeUndefined();
    expect(place.address.addressLocality).toBe("Нижний Новгород");
    expect(place.geo.latitude).toBe(56.326887);
  });

  it("добавляет телефон и улицу, когда они заполнены", () => {
    const graph = venueJsonLd({
      ...placeholderVenue,
      phone: "+7 900 000-00-00",
      address: "ул. Пример, 1",
    })["@graph"];
    const place = graph[1] as { telephone: string; address: { streetAddress: string } };

    expect(place.telephone).toBe("+7 900 000-00-00");
    expect(place.address.streetAddress).toBe("ул. Пример, 1");
  });

  it("собирает хлебные крошки с абсолютными адресами", () => {
    const data = breadcrumbJsonLd([
      { name: "СВОИ", path: "/" },
      { name: "Меню", path: "/menu" },
    ]);

    expect(data.itemListElement.map((item) => item.item)).toEqual([
      "https://svoi.hakolr.dev",
      "https://svoi.hakolr.dev/menu",
    ]);
  });
});
