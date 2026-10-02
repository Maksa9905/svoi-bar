import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { parseSectionPayload } from '../src/sections/section.registry';

const prisma = new PrismaClient();

async function media(id: string, storageKey: string, alt = '', mimeType = 'image/png') {
  await prisma.media.upsert({
    where: { id },
    update: {},
    create: { id, storageKey, alt, mimeType },
  });
  return id;
}

async function main() {
  const heroDesktop = await media('media-hero-desktop', '/images/hero-desktop.png', 'Зал СВОИ');
  const heroMobile = await media('media-hero-mobile', '/images/hero-mobile.png', 'Зал СВОИ');
  const heroMascot = await media('media-hero-mascot', '/images/hero-mascot.png');
  const lounge = await media('media-lounge', '/images/lounge.png', 'Вечерний зал');
  const hookah = await media('media-hookah', '/images/hookah.png', 'Кальян');
  const promo = await media('media-promo', '/images/promo-calavera.png');
  const shots = await media('media-shots', '/images/shots.png', 'Шоты');
  const games = await media('media-games', '/images/games.png', 'Настолки');
  const gamesMascot = await media('media-games-mascot', '/images/games-calavera.png');
  const foodMascot = await media('media-food-mascot', '/images/gallery-mascot.png');
  const ctaMascot = await media('media-cta-character', '/images/cta-calavera.png');
  const wind = await media('media-icon-wind', '/icons/wind.svg', '', 'image/svg+xml');
  const martini = await media('media-icon-martini', '/icons/martini.svg', '', 'image/svg+xml');
  const utensils = await media('media-icon-utensils', '/icons/utensils.svg', '', 'image/svg+xml');
  const dice = await media('media-icon-dice', '/icons/dice.svg', '', 'image/svg+xml');

  const dishes = {
    burrito: await media('media-dish-burrito', '/images/dish-burrito.png', 'Буррито'),
    quesadilla: await media('media-dish-quesadilla', '/images/dish-quesadilla.png', 'Кесадилья'),
    nachos: await media('media-dish-nachos', '/images/dish-nachos.png', 'Начос'),
    burger: await media('media-dish-burger', '/images/dish-burger.png', 'Бургер'),
  };

  const sections: { id: string; type: string; anchor: string | null; payload: unknown }[] = [
    {
      id: 'section-hero',
      type: 'hero',
      anchor: null,
      payload: {
        eyebrow: 'НИЖНИЙ НОВГОРОД',
        kicker: 'КАЛЬЯН · БАР · ЕДА',
        lead: 'Место, где можно просто хорошо провести вечер.',
        primaryLabel: 'ЗАБРОНИРОВАТЬ СТОЛ →',
        secondaryLabel: 'ПОСМОТРЕТЬ МЕНЮ',
        secondaryHref: '/menu',
        backgroundDesktopMediaId: heroDesktop,
        backgroundMobileMediaId: heroMobile,
        mascotMediaId: heroMascot,
      },
    },
    {
      id: 'section-about',
      type: 'text-media',
      anchor: 'about',
      payload: {
        eyebrow: 'О СВОИХ',
        eyebrowColor: '#f0529d',
        title: 'ЗДЕСЬ СОБИРАЮТСЯ СВОИ.',
        body: 'Можно прийти компанией, вдвоём или вообще одному. Заказать кальян, взять пару напитков, поесть, достать настолку и просто никуда не торопиться. СВОИ — это место для тех, кто хочет провести хороший вечер без лишнего пафоса.',
        mediaId: lounge,
        mediaSide: 'right',
      },
    },
    {
      id: 'section-activities',
      type: 'icon-cards',
      anchor: null,
      payload: {
        title: 'ЧЕМ ЗАНЯТЬСЯ У СВОИХ?',
        note: 'Соберите вечер как хочется. Можно всё сразу.',
        cards: [
          { title: 'КАЛЬЯН', text: 'Подберём крепость и вкус под ваш вечер.', iconMediaId: wind, color: '#b7e637' },
          { title: 'БАР', text: 'Коктейли, пиво, шоты и безалкогольные миксы.', iconMediaId: martini, color: '#f0529d' },
          { title: 'ЕДА', text: 'Понятная мексиканская кухня без церемоний.', iconMediaId: utensils, color: '#f4c531' },
          { title: 'НАСТОЛКИ', text: 'Игры для двоих, компании и громкого реванша.', iconMediaId: dice, color: '#9b63e8' },
        ],
      },
    },
    {
      id: 'section-hookah',
      type: 'feature-price',
      anchor: 'hookah',
      payload: {
        eyebrow: 'КАЛЬЯН',
        title: 'ДЫМНЫЙ ВЕЧЕР?',
        lead: 'Кальяны для тех, кто пришёл не спешить.',
        price: 'ОТ 1 000 ₽*',
        buttonLabel: 'ЗАБРОНИРОВАТЬ',
        footnote: '*Актуальную стоимость уточняйте при бронировании.',
        mediaId: hookah,
      },
    },
    {
      id: 'section-promo',
      type: 'promo-banner',
      anchor: null,
      payload: {
        title: 'ДЫМНЫЕ ЧАСЫ 999 ₽',
        schedule: '15:00 — 18:00',
        days: 'ПОНЕДЕЛЬНИК — ЧЕТВЕРГ',
        buttonLabel: 'ЗАБРОНИРОВАТЬ НА БИЗНЕС-КАЛЬЯН →',
        background: '#f4c531',
        mediaId: promo,
      },
    },
    {
      id: 'section-bar',
      type: 'media-band',
      anchor: 'bar',
      payload: {
        eyebrow: 'BAR',
        title: 'ЧТО БУДЕМ ПИТЬ?',
        note: 'Иногда одного кальяна недостаточно.',
        mediaId: shots,
        labels: [
          { title: 'ПИВО', price: 'ОТ 300 ₽*' },
          { title: 'КОКТЕЙЛИ', price: 'ОТ 350 ₽*', accent: true },
          { title: 'ШОТЫ' },
          { title: 'ЛИМОНАДЫ' },
        ],
      },
    },
    {
      id: 'section-food',
      type: 'dish-row',
      anchor: 'food',
      payload: {
        eyebrow: 'FOOD',
        title: 'ГОЛОДНЫМ УХОДИТЬ НЕ ПРИДЁТСЯ.',
        note: 'Мексиканская кухня с понятными вкусами: горячие буррито, хрустящие кесадильи, начос и тот самый бургер.',
        buttonLabel: 'ПОСМОТРЕТЬ ВСЁ МЕНЮ →',
        buttonHref: '/menu',
        mascotMediaId: foodMascot,
        dishes: [
          { title: 'БУРРИТО', mediaId: dishes.burrito, alt: 'Буррито', tall: true },
          { title: 'КЕСАДИЛЬЯ', mediaId: dishes.quesadilla, alt: 'Кесадилья', tall: false },
          { title: 'НАЧОС', mediaId: dishes.nachos, alt: 'Начос', tall: true },
          { title: 'БУРГЕР', mediaId: dishes.burger, alt: 'Бургер', tall: false },
        ],
      },
    },
    {
      id: 'section-games',
      type: 'split',
      anchor: null,
      payload: {
        eyebrow: 'НАСТОЛКИ',
        eyebrowColor: '#9b63e8',
        title: 'НЕ ВСЁ ЖЕ ВЕЧЕР КУРИТЬ КАЛЬЯН.',
        body: 'Можно взять настолку, собрать своих и устроить маленький турнир прямо за столом.',
        mediaId: games,
        mascotMediaId: gamesMascot,
        mediaSide: 'right',
      },
    },
    {
      id: 'section-gallery',
      type: 'gallery-teaser',
      anchor: null,
      payload: {
        title: 'ВООБЩЕ-ТО МЫ КРАСИВЫЕ.',
        note: 'Но лучше один раз увидеть.',
        linkLabel: 'СМОТРЕТЬ ВСЮ ГАЛЕРЕЮ →',
      },
    },
    {
      id: 'section-contacts',
      type: 'contacts',
      anchor: 'contacts',
      payload: { eyebrow: 'КОНТАКТЫ', title: 'УВИДИМСЯ У СВОИХ.' },
    },
    {
      id: 'section-map',
      type: 'map',
      anchor: 'map',
      payload: { title: 'КАК НАС НАЙТИ', routeLabel: 'ПОСТРОИТЬ МАРШРУТ →' },
    },
    {
      id: 'section-cta',
      type: 'cta',
      anchor: null,
      payload: {
        title: 'ТЫ УЖЕ СВОЙ.',
        lead: 'Осталось только выбрать дату.',
        nameLabel: 'ИМЯ ДЛЯ БРОНИ',
        namePlaceholder: 'Введите имя...',
        buttonLabel: 'ЗАБРОНИРОВАТЬ СТОЛ →',
        mascotMediaId: ctaMascot,
      },
    },
  ];

  for (const [sortOrder, section] of sections.entries()) {
    const parsed = parseSectionPayload(section.type, section.payload);
    if (!parsed.success) {
      throw new Error(`Сид секции ${section.id} не прошёл схему`);
    }
    await prisma.section.upsert({
      where: { id: section.id },
      update: {
        payload: parsed.data as Prisma.InputJsonValue,
      },
      create: {
        id: section.id,
        type: section.type,
        anchor: section.anchor,
        sortOrder,
        payload: parsed.data as Prisma.InputJsonValue,
      },
    });
  }

  const links = [
    { id: 'nav-header-hookah', placement: 'header', label: 'КАЛЬЯН', targetType: 'section', sectionId: 'section-hookah', sortOrder: 0 },
    { id: 'nav-header-bar', placement: 'header', label: 'БАР', targetType: 'section', sectionId: 'section-bar', sortOrder: 1 },
    { id: 'nav-header-food', placement: 'header', label: 'ЕДА', targetType: 'page', pagePath: '/menu', sortOrder: 2 },
    { id: 'nav-header-about', placement: 'header', label: 'О СВОИХ', targetType: 'section', sectionId: 'section-about', sortOrder: 3 },
    { id: 'nav-header-contacts', placement: 'header', label: 'КОНТАКТЫ', targetType: 'section', sectionId: 'section-contacts', sortOrder: 4 },
    { id: 'nav-footer-menu', placement: 'footer', label: 'МЕНЮ', targetType: 'page', pagePath: '/menu', sortOrder: 0 },
    { id: 'nav-footer-booking', placement: 'footer', label: 'БРОНИРОВАНИЕ', targetType: 'action', action: 'booking', sortOrder: 1 },
    { id: 'nav-footer-about', placement: 'footer', label: 'О СВОИХ', targetType: 'section', sectionId: 'section-about', sortOrder: 2 },
    { id: 'nav-footer-contacts', placement: 'footer', label: 'КОНТАКТЫ', targetType: 'section', sectionId: 'section-contacts', sortOrder: 3 },
  ];

  for (const link of links) {
    await prisma.navLink.upsert({
      where: { id: link.id },
      update: {},
      create: {
        id: link.id,
        placement: link.placement,
        label: link.label,
        sortOrder: link.sortOrder,
        targetType: link.targetType,
        sectionId: link.sectionId ?? null,
        pagePath: link.pagePath ?? null,
        action: link.action ?? null,
      },
    });
  }

  const filters = [
    ['hookah', 'КАЛЬЯН'],
    ['snacks', 'ЗАКУСКИ'],
    ['sets', 'СЕТЫ'],
    ['hot', 'ГОРЯЧЕЕ'],
    ['pizza', 'ПИЦЦА'],
    ['pasta', 'ПАСТА'],
    ['desserts', 'ДЕСЕРТЫ'],
    ['bar', 'БАР'],
  ] as const;

  for (const [index, [slug, label]] of filters.entries()) {
    await prisma.menuFilter.upsert({
      where: { id: `filter-${slug}` },
      update: {},
      create: { id: `filter-${slug}`, slug, label, sortOrder: index },
    });
  }

  const groups = [
    ['hookah-snacks', 'КАЛЬЯН И ЗАКУСКИ'],
    ['hearty', 'СЫТНОЕ'],
    ['rest', 'ПИЦЦА · ПАСТА · СЛАДКОЕ · БАР'],
  ] as const;

  for (const [index, [slug, title]] of groups.entries()) {
    await prisma.menuGroup.upsert({
      where: { id: `group-${slug}` },
      update: {},
      create: { id: `group-${slug}`, title, sortOrder: index },
    });
  }

  const menuMedia = {
    classic: await media('media-menu-classic', '/images/menu-classic.png', 'Кальян на деревянном столе'),
    berry: await media('media-menu-berry', '/images/menu-berry.png', 'Кальян с ягодным дымом'),
    nachos: await media('media-menu-nachos', '/images/menu-nachos.png', 'Начос с гуакамоле'),
    quesadilla: await media('media-menu-quesadilla', '/images/menu-quesadilla.png', 'Кесадилья'),
    set: await media('media-menu-set', '/images/menu-set.png', 'Сет закусок'),
    burrito: await media('media-menu-burrito', '/images/menu-burrito.png', 'Буррито'),
    burger: await media('media-menu-burger', '/images/menu-burger.png', 'Бургер'),
    diablo: await media('media-menu-pizza', '/images/menu-pizza.png', 'Пицца Diablo'),
    carbonara: await media('media-menu-pasta', '/images/menu-pasta.png', 'Паста'),
    churros: await media('media-menu-churros', '/images/menu-churros.png', 'Чуррос'),
    paloma: await media('media-menu-paloma', '/images/menu-paloma.png', 'Smoky Paloma'),
    mango: await media('media-menu-mango', '/images/menu-mango.png', 'Mango Zero'),
  };

  const items = [
    ['classic', 'hookah', 'hookah-snacks', 'КЛАССИКА', 'Соберём вкус и крепость под настроение.', 'от 1 000 ₽*', '#b7e637', menuMedia.classic],
    ['berry', 'hookah', 'hookah-snacks', 'ЯГОДНЫЙ МИКС', 'Малина, смородина, лёгкая прохлада.', 'от 1 200 ₽*', '#b7e637', menuMedia.berry],
    ['nachos', 'snacks', 'hookah-snacks', 'НАЧОС С ГУАКАМОЛЕ', 'Кукурузные чипсы, сальса, халапеньо.', '390 ₽', '#f4c531', menuMedia.nachos],
    ['quesadilla', 'snacks', 'hookah-snacks', 'КЕСАДИЛЬЯ С КУРИЦЕЙ', 'Сыр, курица, томаты и соус чипотле.', '490 ₽', '#f4c531', menuMedia.quesadilla],
    ['set', 'sets', 'hearty', 'СЕТ ДЛЯ СВОИХ', 'Начос, крылья, кесадилья и три соуса.', '1 290 ₽', '#d94a3a', menuMedia.set],
    ['burrito', 'hot', 'hearty', 'БУРРИТО С ГОВЯДИНОЙ', 'Томлёная говядина, рис, фасоль, сальса.', '590 ₽', '#f4c531', menuMedia.burrito],
    ['burger', 'hot', 'hearty', 'БУРГЕР С ЧЕДДЕРОМ', 'Говядина, чеддер, салат, фирменный соус.', '650 ₽', '#d94a3a', menuMedia.burger],
    ['diablo', 'pizza', 'hearty', 'DIABLO', 'Пепперони, халапеньо, моцарелла, чили.', '690 ₽', '#d94a3a', menuMedia.diablo],
    ['carbonara', 'pasta', 'rest', 'ЧИПОТЛЕ КАРБОНАРА', 'Бекон, сливки, пармезан, дымный перец.', '560 ₽', '#f0529d', menuMedia.carbonara],
    ['churros', 'desserts', 'rest', 'ЧУРРОС', 'Корица, сахар и тёплый шоколад.', '390 ₽', '#9b63e8', menuMedia.churros],
    ['paloma', 'bar', 'rest', 'SMOKY PALOMA', 'Текила, грейпфрут, лайм, дымная соль.', '470 ₽', '#f0529d', menuMedia.paloma],
    ['mango', 'bar', 'rest', 'MANGO ZERO', 'Манго, лайм, тоник и свежая мята.', '350 ₽', '#f0529d', menuMedia.mango],
  ] as const;

  for (const [index, [slug, filter, group, title, description, price, accent, image]] of items.entries()) {
    const groupItemsBefore = items.slice(0, index).filter((item) => item[2] === group).length;
    await prisma.menuItem.upsert({
      where: { id: `item-${slug}` },
      update: {},
      create: {
        id: `item-${slug}`,
        filterId: `filter-${filter}`,
        groupId: `group-${group}`,
        mediaId: image,
        title,
        description,
        price,
        accent,
        alt: title,
        sortOrder: groupItemsBefore,
      },
    });
  }

  const gallery: {
    slug: string;
    src: string;
    caption: string;
    alt: string;
    height: number;
    showOnHome: boolean;
    mascot?: { src: string; side: 'left' | 'right' | 'top' };
  }[] = [
    { slug: 'c1-1', src: '/images/gallery-c1-1.png', caption: 'Неон над стойкой', alt: 'Барная стойка и неоновый череп', height: 430, showOnHome: true },
    { slug: 'c1-2', src: '/images/gallery-c1-2.png', caption: 'Линия шотов', alt: 'Ряд коктейлей на барной стойке', height: 280, showOnHome: false },
    { slug: 'c1-3', src: '/images/gallery-c1-3.png', caption: 'Тёплый вечер у СВОИХ', alt: 'Компания за настольной игрой', height: 500, showOnHome: true },
    { slug: 'c1-4', src: '/images/gallery-c1-4.png', caption: 'Голодным уходить не придётся', alt: 'Буррито в разрезе', height: 330, showOnHome: false },
    { slug: 'c1-5', src: '/images/gallery-c1-5.png', caption: 'Свет, который остаётся', alt: 'Вечерний зал с лампами', height: 420, showOnHome: true },
    { slug: 'c2-1', src: '/images/gallery-c2-1.png', caption: 'Свои за одним столом', alt: 'Гости за столом', height: 300, showOnHome: false },
    { slug: 'c2-2', src: '/images/gallery-c2-2.png', caption: 'Дымный вечер', alt: 'Кальян в полумраке', height: 520, showOnHome: true, mascot: { src: '/images/gallery-c2-mascot.png', side: 'left' } },
    { slug: 'c2-3', src: '/images/gallery-c2-3.png', caption: 'Бар без церемоний', alt: 'Коктейль крупным планом', height: 360, showOnHome: false },
    { slug: 'c2-4', src: '/images/gallery-c2-4.png', caption: 'Место, где не спешат', alt: 'Зал кальянной', height: 480, showOnHome: false },
    { slug: 'c2-5', src: '/images/gallery-c2-5.png', caption: 'Ещё один раунд', alt: 'Детали сервировки', height: 290, showOnHome: false },
    { slug: 'c3-1', src: '/images/gallery-c3-1.png', caption: 'Зал у СВОИХ', alt: 'Длинный зал с диванами', height: 510, showOnHome: false },
    { slug: 'c3-2', src: '/images/gallery-c3-2.png', caption: 'Что будем пить', alt: 'Бармен готовит коктейль', height: 320, showOnHome: true },
    { slug: 'c3-3', src: '/images/gallery-c3-3.png', caption: 'Можно просто посидеть', alt: 'Мягкая зона у стены', height: 410, showOnHome: false },
    { slug: 'c3-4', src: '/images/gallery-c3-4.png', caption: 'Тёплый свет', alt: 'Лампа над столом', height: 300, showOnHome: false },
    { slug: 'c3-5', src: '/images/gallery-c3-5.png', caption: 'Остаются ещё на один раунд', alt: 'Компания с кальяном', height: 430, showOnHome: false, mascot: { src: '/images/gallery-c3-mascot.png', side: 'right' } },
    { slug: 'c4-1', src: '/images/gallery-c4-1.png', caption: 'Характер места', alt: 'Интерьер бара', height: 350, showOnHome: false },
    { slug: 'c4-2', src: '/images/gallery-c4-2.png', caption: 'Еда к вечеру', alt: 'Гости ужинают', height: 460, showOnHome: false },
    { slug: 'c4-3', src: '/images/gallery-c4-3.png', caption: 'Тихий угол', alt: 'Кресла и торшер', height: 280, showOnHome: false },
    { slug: 'c4-4', src: '/images/gallery-c4-4.png', caption: 'Дым, музыка, свет', alt: 'Вечер в зале', height: 540, showOnHome: false },
    { slug: 'c4-5', src: '/images/gallery-c4-5.png', caption: 'Красивые, вообще-то', alt: 'Кальян с розовой подсветкой', height: 350, showOnHome: true, mascot: { src: '/images/gallery-c4-mascot.png', side: 'top' } },
  ];

  let homeOrder = 0;
  for (const [index, photo] of gallery.entries()) {
    const imageId = await media(`media-gallery-${photo.slug}`, photo.src, photo.alt);
    const mascotId = photo.mascot
      ? await media(`media-gallery-${photo.slug}-mascot`, photo.mascot.src)
      : null;
    await prisma.galleryItem.upsert({
      where: { id: `gallery-${photo.slug}` },
      update: {},
      create: {
        id: `gallery-${photo.slug}`,
        mediaId: imageId,
        caption: photo.caption,
        alt: photo.alt,
        height: photo.height,
        sortOrder: index,
        showOnHome: photo.showOnHome,
        homeSortOrder: photo.showOnHome ? homeOrder++ : null,
        mascotMediaId: mascotId,
        mascotSide: photo.mascot?.side ?? null,
      },
    });
  }

  const passwordHash = await bcrypt.hash('password', 10);
  await prisma.adminUser.upsert({
    where: { login: 'admin' },
    update: { passwordHash },
    create: { id: 'user-admin', login: 'admin', passwordHash },
  });

  await prisma.venue.upsert({
    where: { id: 'venue' },
    update: {},
    create: {
      id: 'venue',
      name: 'СВОИ',
      city: 'Нижний Новгород',
      descriptor: 'Кальян · Бар · Еда',
      phone: '[ТЕЛЕФОН]',
      address: '[АДРЕС]',
      hours: '[ЧАСЫ РАБОТЫ]',
      lat: 56.326887,
      lon: 44.005986,
      legal: '© 2026 СВОИ. 18+',
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
