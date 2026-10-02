import { z } from 'zod';

const mediaId = z.string().min(1);
const optionalMediaId = mediaId.optional();

export const sectionTypes = [
  'hero',
  'text-media',
  'icon-cards',
  'feature-price',
  'promo-banner',
  'media-band',
  'dish-row',
  'split',
  'gallery-teaser',
  'contacts',
  'map',
  'cta',
] as const;

export type SectionType = (typeof sectionTypes)[number];

const heroSchema = z.object({
  eyebrow: z.string().min(1),
  kicker: z.string().min(1),
  lead: z.string().min(1),
  primaryLabel: z.string().min(1),
  secondaryLabel: z.string().min(1),
  secondaryHref: z.string().min(1),
  backgroundDesktopMediaId: mediaId,
  backgroundMobileMediaId: mediaId,
  mascotMediaId: optionalMediaId,
});

const textMediaSchema = z.object({
  eyebrow: z.string().min(1),
  eyebrowColor: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  mediaId,
  mediaSide: z.enum(['left', 'right']),
});

const iconCardsSchema = z.object({
  title: z.string().min(1),
  note: z.string().min(1),
  cards: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
        iconMediaId: mediaId,
        color: z.string().min(1),
      }),
    )
    .min(1),
});

const featurePriceSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  lead: z.string().min(1),
  price: z.string().min(1),
  buttonLabel: z.string().min(1),
  footnote: z.string().min(1),
  mediaId,
});

const promoBannerSchema = z.object({
  title: z.string().min(1),
  schedule: z.string().min(1),
  days: z.string().min(1),
  buttonLabel: z.string().min(1),
  background: z.string().min(1),
  mediaId,
});

const mediaBandSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  note: z.string().min(1),
  mediaId,
  labels: z
    .array(
      z.object({
        title: z.string().min(1),
        price: z.string().optional(),
        accent: z.boolean().optional(),
      }),
    )
    .min(1),
});

const dishRowSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  note: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
  mascotMediaId: optionalMediaId,
  dishes: z
    .array(
      z.object({
        title: z.string().min(1),
        mediaId,
        alt: z.string(),
        tall: z.boolean(),
      }),
    )
    .min(1),
});

const splitSchema = z.object({
  eyebrow: z.string().min(1),
  eyebrowColor: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  mediaId,
  mascotMediaId: optionalMediaId,
  mediaSide: z.enum(['left', 'right']),
});

const galleryTeaserSchema = z.object({
  title: z.string().min(1),
  note: z.string().min(1),
  linkLabel: z.string().min(1),
});

const contactsSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
});

const mapSchema = z.object({
  title: z.string().min(1),
  routeLabel: z.string().min(1),
});

const ctaSchema = z.object({
  title: z.string().min(1),
  lead: z.string().min(1),
  nameLabel: z.string().min(1),
  namePlaceholder: z.string().min(1),
  buttonLabel: z.string().min(1),
  mascotMediaId: optionalMediaId,
});

type SectionDefinition = {
  schema: z.ZodType;
  defaultPayload: unknown;
};

export const sectionRegistry: Record<SectionType, SectionDefinition> = {
  hero: {
    schema: heroSchema,
    defaultPayload: {
      eyebrow: 'НИЖНИЙ НОВГОРОД',
      kicker: 'КАЛЬЯН · БАР · ЕДА',
      lead: 'Место, где можно просто хорошо провести вечер.',
      primaryLabel: 'ЗАБРОНИРОВАТЬ СТОЛ →',
      secondaryLabel: 'ПОСМОТРЕТЬ МЕНЮ',
      secondaryHref: '/menu',
      backgroundDesktopMediaId: 'replace-me',
      backgroundMobileMediaId: 'replace-me',
    },
  },
  'text-media': {
    schema: textMediaSchema,
    defaultPayload: {
      eyebrow: 'О СВОИХ',
      eyebrowColor: '#f0529d',
      title: 'ЗАГОЛОВОК',
      body: 'Текст секции.',
      mediaId: 'replace-me',
      mediaSide: 'right',
    },
  },
  'icon-cards': {
    schema: iconCardsSchema,
    defaultPayload: {
      title: 'ЧЕМ ЗАНЯТЬСЯ?',
      note: 'Соберите вечер как хочется.',
      cards: [
        {
          title: 'КАЛЬЯН',
          text: 'Короткое описание.',
          iconMediaId: 'replace-me',
          color: '#b7e637',
        },
      ],
    },
  },
  'feature-price': {
    schema: featurePriceSchema,
    defaultPayload: {
      eyebrow: 'КАЛЬЯН',
      title: 'ДЫМНЫЙ ВЕЧЕР?',
      lead: 'Кальяны для тех, кто пришёл не спешить.',
      price: 'ОТ 1 000 ₽*',
      buttonLabel: 'ЗАБРОНИРОВАТЬ',
      footnote: '*Актуальную стоимость уточняйте при бронировании.',
      mediaId: 'replace-me',
    },
  },
  'promo-banner': {
    schema: promoBannerSchema,
    defaultPayload: {
      title: 'АКЦИЯ',
      schedule: '15:00 — 18:00',
      days: 'ПОНЕДЕЛЬНИК — ЧЕТВЕРГ',
      buttonLabel: 'ЗАБРОНИРОВАТЬ →',
      background: '#f4c531',
      mediaId: 'replace-me',
    },
  },
  'media-band': {
    schema: mediaBandSchema,
    defaultPayload: {
      eyebrow: 'BAR',
      title: 'ЧТО БУДЕМ ПИТЬ?',
      note: 'Иногда одного кальяна недостаточно.',
      mediaId: 'replace-me',
      labels: [{ title: 'ПИВО', price: 'ОТ 300 ₽*' }],
    },
  },
  'dish-row': {
    schema: dishRowSchema,
    defaultPayload: {
      eyebrow: 'FOOD',
      title: 'ГОЛОДНЫМ УХОДИТЬ НЕ ПРИДЁТСЯ.',
      note: 'Понятная кухня без церемоний.',
      buttonLabel: 'ПОСМОТРЕТЬ ВСЁ МЕНЮ →',
      buttonHref: '/menu',
      dishes: [{ title: 'БЛЮДО', mediaId: 'replace-me', alt: '', tall: true }],
    },
  },
  split: {
    schema: splitSchema,
    defaultPayload: {
      eyebrow: 'НАСТОЛКИ',
      eyebrowColor: '#9b63e8',
      title: 'НЕ ВСЁ ЖЕ ВЕЧЕР КУРИТЬ КАЛЬЯН.',
      body: 'Можно взять настолку и устроить маленький турнир.',
      mediaId: 'replace-me',
      mediaSide: 'right',
    },
  },
  'gallery-teaser': {
    schema: galleryTeaserSchema,
    defaultPayload: {
      title: 'ВООБЩЕ-ТО МЫ КРАСИВЫЕ.',
      note: 'Но лучше один раз увидеть.',
      linkLabel: 'СМОТРЕТЬ ВСЮ ГАЛЕРЕЮ →',
    },
  },
  contacts: {
    schema: contactsSchema,
    defaultPayload: {
      eyebrow: 'КОНТАКТЫ',
      title: 'УВИДИМСЯ У СВОИХ.',
    },
  },
  map: {
    schema: mapSchema,
    defaultPayload: {
      title: 'КАК НАС НАЙТИ',
      routeLabel: 'ПОСТРОИТЬ МАРШРУТ →',
    },
  },
  cta: {
    schema: ctaSchema,
    defaultPayload: {
      title: 'ТЫ УЖЕ СВОЙ.',
      lead: 'Осталось только выбрать дату.',
      nameLabel: 'ИМЯ ДЛЯ БРОНИ',
      namePlaceholder: 'Введите имя...',
      buttonLabel: 'ЗАБРОНИРОВАТЬ СТОЛ →',
    },
  },
};

export function isSectionType(value: string): value is SectionType {
  return sectionTypes.includes(value as SectionType);
}

export function parseSectionPayload(type: string, payload: unknown) {
  if (!isSectionType(type)) {
    return { success: false as const, error: 'Неизвестный тип секции' };
  }

  const parsed = sectionRegistry[type].schema.safeParse(payload);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() };
  }

  return { success: true as const, data: parsed.data };
}

export const anchorSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Якорь: латиница, цифры и дефис')
  .nullable();
