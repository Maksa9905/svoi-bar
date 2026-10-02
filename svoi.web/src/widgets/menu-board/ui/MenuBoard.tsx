"use client";

import { observer } from "mobx-react-lite";
import { useSite } from "@/entities/site";
import { filterMenu } from "@/features/filter-menu";
import { resolveAssetUrl } from "@/shared/config/api";
import { formatPositionCount } from "@/shared/lib/plural";
import { uiStore } from "@/shared/model/ui-store";
import { BookButton } from "@/shared/ui/button/BookButton";
import { CoverImage } from "@/shared/ui/media/CoverImage";
import styles from "./MenuBoard.module.css";

export const MenuBoard = observer(function MenuBoard() {
  const site = useSite();
  const menu = site.data?.menu;
  const sections = menu ? filterMenu(menu, uiStore.menuCategory) : [];
  const filters = [{ id: "all", slug: "all", label: "ВСЁ" }, ...(menu?.filters ?? [])];

  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>ЕДА · БАР · КАЛЬЯН</p>
          <h1>МЕНЮ</h1>
          <p className={styles.subtitle}>Выбирай, что сегодня будем.</p>
        </div>
        <p className={styles.aside}>
          Фотографии показывают характер подачи. Состав и стоимость могут уточняться.
        </p>
      </section>

      <div className={styles.tabs} role="tablist" aria-label="Категории меню">
        {filters.map((category) => {
          const active = uiStore.menuCategory === category.slug;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? styles.tabActive : styles.tab}
              onClick={() => uiStore.setMenuCategory(category.slug)}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className={styles.content}>
        {site.isError ? <p className={styles.status}>Меню сейчас не загрузилось.</p> : null}
        {site.isPending ? <p className={styles.status}>Собираем меню...</p> : null}
        {sections.map((section) => (
          <section key={section.id}>
            <div className={styles.sectionHead}>
              <h2>{section.title}</h2>
              <p className={styles.count}>{formatPositionCount(section.items.length)}</p>
            </div>
            <div className={styles.grid}>
              {section.items.map((item) => (
                <article key={item.id} className={styles.card}>
                  <CoverImage
                    className={styles.photo}
                    src={resolveAssetUrl(item.media.url)}
                    alt={item.alt}
                    sizes="(max-width: 899px) 100vw, 25vw"
                  />
                  <div>
                    <p className={styles.tag} style={{ color: item.accent }}>
                      {item.filter.label}
                    </p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p className={styles.price}>{item.price}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className={styles.banner}>
          <p>ВЫБРАЛИ? ТЕПЕРЬ НУЖЕН СТОЛ.</p>
          <BookButton variant="dark">ЗАБРОНИРОВАТЬ →</BookButton>
        </div>
        <p className={styles.footnote}>
          *Актуальную стоимость кальяна уточняйте при бронировании. Цены проверить перед
          публикацией.
        </p>
      </div>
    </>
  );
});
