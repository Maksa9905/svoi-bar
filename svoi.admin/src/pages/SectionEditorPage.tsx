import { Alert, Button, MenuItem, Snackbar, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaField } from "@/features/media/MediaField";
import { api, errorText } from "@/shared/api";
import { brandColors, sectionTypeLabels } from "@/shared/labels";
import type { Section } from "@/shared/types";
import { PageHeader } from "./PageHeader";

const textFields: Record<string, { key: string; label: string; hint: string; multiline?: boolean }[]> = {
  hero: [
    { key: "eyebrow", label: "Надзаголовок", hint: "Мелкий текст над главным" },
    { key: "kicker", label: "Строка под ним", hint: "Например: кальян · бар · еда" },
    { key: "lead", label: "Короткий текст", hint: "Под заголовком первого экрана", multiline: true },
    { key: "primaryLabel", label: "Текст основной кнопки", hint: "Открывает бронь" },
    { key: "secondaryLabel", label: "Текст второй кнопки", hint: "Рядом с основной" },
    { key: "secondaryHref", label: "Куда ведёт вторая кнопка", hint: "Путь, например /menu" },
  ],
  "text-media": [
    { key: "eyebrow", label: "Надзаголовок", hint: "Мелкая строка над заголовком" },
    { key: "title", label: "Заголовок", hint: "Крупный текст секции" },
    { key: "body", label: "Текст", hint: "Абзац под заголовком", multiline: true },
  ],
  "icon-cards": [
    { key: "title", label: "Заголовок", hint: "Название блока" },
    { key: "note", label: "Пояснение", hint: "Строка справа от заголовка" },
  ],
  "feature-price": [
    { key: "eyebrow", label: "Надзаголовок", hint: "Мелкая строка" },
    { key: "title", label: "Заголовок", hint: "Крупный текст" },
    { key: "lead", label: "Текст", hint: "Под заголовком", multiline: true },
    { key: "price", label: "Цена", hint: "Как на сайте, например ОТ 1 000 ₽*" },
    { key: "buttonLabel", label: "Текст кнопки", hint: "Кнопка брони" },
    { key: "footnote", label: "Сноска", hint: "Мелкий текст под ценой" },
  ],
  "promo-banner": [
    { key: "title", label: "Заголовок", hint: "Название акции" },
    { key: "schedule", label: "Часы", hint: "Например 15:00 — 18:00" },
    { key: "days", label: "Дни", hint: "Когда действует акция" },
    { key: "buttonLabel", label: "Текст кнопки", hint: "Кнопка брони" },
  ],
  "media-band": [
    { key: "eyebrow", label: "Надзаголовок", hint: "Мелкая строка" },
    { key: "title", label: "Заголовок", hint: "Крупный текст" },
    { key: "note", label: "Пояснение", hint: "Строка под заголовком" },
  ],
  "dish-row": [
    { key: "eyebrow", label: "Надзаголовок", hint: "Мелкая строка" },
    { key: "title", label: "Заголовок", hint: "Крупный текст" },
    { key: "note", label: "Пояснение", hint: "Справа от заголовка" },
    { key: "buttonLabel", label: "Текст кнопки", hint: "Ссылка на меню" },
    { key: "buttonHref", label: "Куда ведёт кнопка", hint: "Путь, например /menu" },
  ],
  split: [
    { key: "eyebrow", label: "Надзаголовок", hint: "Мелкая строка" },
    { key: "title", label: "Заголовок", hint: "Крупный текст" },
    { key: "body", label: "Текст", hint: "Абзац", multiline: true },
  ],
  "gallery-teaser": [
    { key: "title", label: "Заголовок", hint: "Фото берутся из раздела Галерея" },
    { key: "note", label: "Пояснение", hint: "Строка рядом с заголовком" },
    { key: "linkLabel", label: "Текст ссылки", hint: "Ведёт на страницу галереи" },
  ],
  contacts: [
    { key: "eyebrow", label: "Надзаголовок", hint: "Адрес и телефон берутся из раздела Заведение" },
    { key: "title", label: "Заголовок", hint: "Крупный текст" },
  ],
  map: [
    { key: "title", label: "Заголовок", hint: "Над картой" },
    { key: "routeLabel", label: "Текст ссылки", hint: "Построить маршрут" },
  ],
  cta: [
    { key: "title", label: "Заголовок", hint: "Крупный текст" },
    { key: "lead", label: "Текст", hint: "Под заголовком" },
    { key: "buttonLabel", label: "Текст кнопки", hint: "Открывает бронь" },
  ],
};

const mediaFields: Record<string, { key: string; label: string; hint: string }[]> = {
  hero: [
    { key: "backgroundDesktopMediaId", label: "Фон на компьютере", hint: "Большое фото первого экрана" },
    { key: "backgroundMobileMediaId", label: "Фон на телефоне", hint: "Вертикальное фото" },
    { key: "mascotMediaId", label: "Персонаж", hint: "Скелет справа" },
  ],
  "text-media": [{ key: "mediaId", label: "Фото", hint: "Рядом с текстом" }],
  "feature-price": [{ key: "mediaId", label: "Фото", hint: "Слева от текста" }],
  "promo-banner": [{ key: "mediaId", label: "Картинка", hint: "Персонаж на баннере" }],
  "media-band": [{ key: "mediaId", label: "Фото напитков", hint: "Полоса над ценами" }],
  "dish-row": [{ key: "mascotMediaId", label: "Персонаж", hint: "Скелет у блока еды" }],
  split: [
    { key: "mediaId", label: "Фото", hint: "Большое фото секции" },
    { key: "mascotMediaId", label: "Персонаж", hint: "Рядом с текстом" },
  ],
  cta: [{ key: "mascotMediaId", label: "Персонаж", hint: "Скелет у брони" }],
};

export function SectionEditorPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sections = useQuery({
    queryKey: ["sections"],
    queryFn: () => api<Section[]>("/api/admin/sections"),
  });
  const section = sections.data?.find((item) => item.id === id);
  const [payload, setPayload] = useState<Record<string, unknown>>({});
  const [anchor, setAnchor] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!section) {
      return;
    }
    setPayload(section.payload ?? {});
    setAnchor(section.anchor ?? "");
  }, [section]);

  const save = useMutation({
    mutationFn: () =>
      api(`/api/admin/sections/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ anchor: anchor || null, payload }),
      }),
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });

  if (sections.isPending) {
    return <p>Загружаем блок...</p>;
  }
  if (!section) {
    return <Alert severity="error">Блок не найден</Alert>;
  }

  const setField = (key: string, value: unknown) => setPayload((current) => ({ ...current, [key]: value }));

  return (
    <>
      <PageHeader
        title={sectionTypeLabels[section.type] ?? section.type}
        lead="Тип блока не меняется. Сохранили — на сайте уже новое."
      />
      <Button onClick={() => navigate("/sections")}>К списку</Button>
      <TextField
        fullWidth
        margin="normal"
        label="Якорь"
        helperText="Латиница и дефис. Нужен, если на блок ведёт пункт меню. Пример: bar"
        value={anchor}
        onChange={(event) => setAnchor(event.target.value)}
      />
      {(textFields[section.type] ?? []).map((field) => (
        <TextField
          key={field.key}
          fullWidth
          margin="normal"
          multiline={field.multiline}
          label={field.label}
          helperText={field.hint}
          value={String(payload[field.key] ?? "")}
          onChange={(event) => setField(field.key, event.target.value)}
        />
      ))}
      {section.type === "text-media" || section.type === "split" ? (
        <TextField
          select
          fullWidth
          margin="normal"
          label="Где фото"
          helperText="Слева или справа от текста"
          value={String(payload.mediaSide ?? "right")}
          onChange={(event) => setField("mediaSide", event.target.value)}
        >
          <MenuItem value="left">Слева</MenuItem>
          <MenuItem value="right">Справа</MenuItem>
        </TextField>
      ) : null}
      {section.type === "text-media" || section.type === "split" || section.type === "promo-banner" ? (
        <TextField
          select
          fullWidth
          margin="normal"
          label={section.type === "promo-banner" ? "Цвет фона" : "Цвет надзаголовка"}
          value={String(payload[section.type === "promo-banner" ? "background" : "eyebrowColor"] ?? brandColors[0].value)}
          onChange={(event) =>
            setField(section.type === "promo-banner" ? "background" : "eyebrowColor", event.target.value)
          }
        >
          {brandColors.map((color) => (
            <MenuItem key={color.value} value={color.value}>
              {color.label}
            </MenuItem>
          ))}
        </TextField>
      ) : null}
      {(mediaFields[section.type] ?? []).map((field) => (
        <MediaField
          key={field.key}
          label={field.label}
          hint={field.hint}
          value={typeof payload[field.key] === "string" ? (payload[field.key] as string) : undefined}
          onChange={(mediaId) => setField(field.key, mediaId)}
        />
      ))}
      {section.type === "dish-row" ? (
        <DishList
          dishes={(payload.dishes as { title: string; mediaId: string; alt: string }[]) ?? []}
          onChange={(dishes) => setField("dishes", dishes)}
        />
      ) : null}
      {section.type === "media-band" ? (
        <LabelList
          labels={(payload.labels as { title: string; price?: string; accent?: boolean }[]) ?? []}
          onChange={(labels) => setField("labels", labels)}
        />
      ) : null}
      {section.type === "icon-cards" ? (
        <CardList
          cards={(payload.cards as { title: string; text: string; iconMediaId: string; color: string }[]) ?? []}
          onChange={(cards) => setField("cards", cards)}
        />
      ) : null}
      {save.isError ? <Alert severity="error">{errorText(save.error)}</Alert> : null}
      <Button variant="contained" onClick={() => save.mutate()} disabled={save.isPending} sx={{ mt: 2 }}>
        Сохранить блок
      </Button>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Сохранено. На сайте уже новое." />
    </>
  );
}

function DishList({
  dishes,
  onChange,
}: {
  dishes: { title: string; mediaId: string; alt: string }[];
  onChange: (dishes: { title: string; mediaId: string; alt: string }[]) => void;
}) {
  return (
    <div>
      <h2>Блюда</h2>
      {dishes.map((dish, index) => (
        <div key={index}>
          <TextField
            fullWidth
            margin="normal"
            label="Название"
            value={dish.title}
            onChange={(event) => onChange(dishes.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)))}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Подпись для незрячих"
            value={dish.alt}
            onChange={(event) => onChange(dishes.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)))}
          />
          <MediaField
            label="Фото блюда"
            value={dish.mediaId}
            onChange={(mediaId) =>
              onChange(dishes.map((item, i) => (i === index ? { ...item, mediaId: mediaId ?? "" } : item)))
            }
          />
        </div>
      ))}
    </div>
  );
}

function LabelList({
  labels,
  onChange,
}: {
  labels: { title: string; price?: string; accent?: boolean }[];
  onChange: (labels: { title: string; price?: string; accent?: boolean }[]) => void;
}) {
  return (
    <div>
      <h2>Напитки</h2>
      {labels.map((label, index) => (
        <div key={index}>
          <TextField
            fullWidth
            margin="normal"
            label="Название"
            value={label.title}
            onChange={(event) =>
              onChange(labels.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Цена"
            helperText="Можно оставить пустой"
            value={label.price ?? ""}
            onChange={(event) =>
              onChange(labels.map((item, i) => (i === index ? { ...item, price: event.target.value } : item)))
            }
          />
        </div>
      ))}
    </div>
  );
}

function CardList({
  cards,
  onChange,
}: {
  cards: { title: string; text: string; iconMediaId: string; color: string }[];
  onChange: (cards: { title: string; text: string; iconMediaId: string; color: string }[]) => void;
}) {
  return (
    <div>
      <h2>Карточки</h2>
      {cards.map((card, index) => (
        <div key={index}>
          <TextField
            fullWidth
            margin="normal"
            label="Название"
            value={card.title}
            onChange={(event) =>
              onChange(cards.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Текст"
            value={card.text}
            onChange={(event) =>
              onChange(cards.map((item, i) => (i === index ? { ...item, text: event.target.value } : item)))
            }
          />
          <MediaField
            label="Иконка"
            value={card.iconMediaId}
            onChange={(iconMediaId) =>
              onChange(cards.map((item, i) => (i === index ? { ...item, iconMediaId: iconMediaId ?? "" } : item)))
            }
          />
        </div>
      ))}
    </div>
  );
}
