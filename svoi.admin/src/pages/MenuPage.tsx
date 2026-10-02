import { Alert, Button, TextField } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MediaField } from "@/features/media/MediaField";
import { api, errorText } from "@/shared/api";
import { moveItem } from "@/shared/order";
import type { MenuFilter, MenuGroup, MenuItem } from "@/shared/types";
import { PageHeader } from "./PageHeader";
import styles from "./table.module.css";

type Catalog = { filters: MenuFilter[]; groups: MenuGroup[]; items: MenuItem[] };

export function MenuPage() {
  const queryClient = useQueryClient();
  const catalog = useQuery({
    queryKey: ["menu"],
    queryFn: () => api<Catalog>("/api/admin/menu"),
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["menu"] });
  const [slug, setSlug] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [error, setError] = useState("");

  const run = async (path: string, method: string, body?: unknown) => {
    try {
      setError("");
      await api(path, { method, body: body ? JSON.stringify(body) : undefined });
      refresh();
    } catch (reason) {
      setError(errorText(reason));
    }
  };

  const filters = catalog.data?.filters ?? [];
  const groups = catalog.data?.groups ?? [];
  const items = catalog.data?.items ?? [];

  return (
    <>
      <PageHeader title="Меню" lead="Пункт «ВСЁ» на сайте есть сам, его добавлять не нужно." />
      {catalog.isError ? <Alert severity="error">{errorText(catalog.error)}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <div className={styles.columns}>
        <section className={styles.card}>
          <h2>Фильтры</h2>
          {filters.map((filter, index) => (
            <div className={styles.row} key={filter.id}>
              <span>
                {filter.label} <small>{filter.slug}</small>
              </span>
              <span>
                <Button size="small" disabled={index === 0} onClick={() => run("/api/admin/menu/filters/order", "PATCH", { ids: moveItem(filters, index, -1).map((item) => item.id) })}>
                  Выше
                </Button>
                <Button size="small" color="error" onClick={() => run(`/api/admin/menu/filters/${filter.id}`, "DELETE")}>
                  Удалить
                </Button>
              </span>
            </div>
          ))}
          <TextField fullWidth margin="dense" label="Название" value={filterLabel} onChange={(event) => setFilterLabel(event.target.value)} />
          <TextField fullWidth margin="dense" label="Адрес фильтра" helperText="Латиница, посетитель это не видит" value={slug} onChange={(event) => setSlug(event.target.value)} />
          <Button onClick={() => run("/api/admin/menu/filters", "POST", { slug, label: filterLabel })}>Добавить фильтр</Button>
        </section>
        <section className={styles.card}>
          <h2>Группы</h2>
          {groups.map((group, index) => (
            <div className={styles.row} key={group.id}>
              <span>{group.title}</span>
              <span>
                <Button size="small" disabled={index === 0} onClick={() => run("/api/admin/menu/groups/order", "PATCH", { ids: moveItem(groups, index, -1).map((item) => item.id) })}>
                  Выше
                </Button>
                <Button size="small" color="error" onClick={() => run(`/api/admin/menu/groups/${group.id}`, "DELETE")}>
                  Удалить
                </Button>
              </span>
            </div>
          ))}
          <TextField fullWidth margin="dense" label="Название группы" value={groupTitle} onChange={(event) => setGroupTitle(event.target.value)} />
          <Button onClick={() => run("/api/admin/menu/groups", "POST", { title: groupTitle })}>Добавить группу</Button>
        </section>
        <section className={styles.card}>
          <h2>Позиции</h2>
          {items.map((item) => (
            <div className={styles.row} key={item.id}>
              <span>
                {item.title} <small>{item.price}</small>
              </span>
              <Button size="small" color="error" onClick={() => run(`/api/admin/menu/items/${item.id}`, "DELETE")}>
                Удалить
              </Button>
            </div>
          ))}
          <ItemForm filters={filters} groups={groups} onCreate={(body) => run("/api/admin/menu/items", "POST", body)} />
        </section>
      </div>
    </>
  );
}

function ItemForm({
  filters,
  groups,
  onCreate,
}: {
  filters: MenuFilter[];
  groups: MenuGroup[];
  onCreate: (body: Record<string, string>) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [filterId, setFilterId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [mediaId, setMediaId] = useState<string>();

  return (
    <>
      <TextField fullWidth margin="dense" label="Название" value={title} onChange={(event) => setTitle(event.target.value)} />
      <TextField fullWidth margin="dense" label="Описание" value={description} onChange={(event) => setDescription(event.target.value)} />
      <TextField fullWidth margin="dense" label="Цена" value={price} onChange={(event) => setPrice(event.target.value)} />
      <TextField select fullWidth margin="dense" label="Фильтр" value={filterId} onChange={(event) => setFilterId(event.target.value)} SelectProps={{ native: true }}>
        <option value="" />
        {filters.map((filter) => (
          <option key={filter.id} value={filter.id}>
            {filter.label}
          </option>
        ))}
      </TextField>
      <TextField select fullWidth margin="dense" label="Группа" value={groupId} onChange={(event) => setGroupId(event.target.value)} SelectProps={{ native: true }}>
        <option value="" />
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.title}
          </option>
        ))}
      </TextField>
      <MediaField label="Фото" value={mediaId} onChange={setMediaId} />
      <Button
        variant="contained"
        onClick={() =>
          onCreate({
            title,
            description,
            price,
            filterId,
            groupId,
            mediaId: mediaId ?? "",
            accent: "#B7E637",
            alt: title,
          })
        }
      >
        Добавить позицию
      </Button>
    </>
  );
}
