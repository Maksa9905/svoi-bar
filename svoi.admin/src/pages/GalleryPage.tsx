import { Alert, Button, Switch, TextField } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MediaField } from "@/features/media/MediaField";
import { api, assetUrl, errorText } from "@/shared/api";
import { moveItem } from "@/shared/order";
import type { GalleryItem } from "@/shared/types";
import { PageHeader } from "./PageHeader";
import styles from "./table.module.css";

export function GalleryPage() {
  const queryClient = useQueryClient();
  const gallery = useQuery({
    queryKey: ["gallery"],
    queryFn: () => api<GalleryItem[]>("/api/admin/gallery"),
  });
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [mediaId, setMediaId] = useState<string>();
  const [error, setError] = useState("");
  const items = gallery.data ?? [];

  const run = async (path: string, method: string, body?: unknown) => {
    try {
      setError("");
      await api(path, { method, body: body ? JSON.stringify(body) : undefined });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (reason) {
      setError(errorText(reason));
    }
  };

  return (
    <>
      <PageHeader title="Галерея" lead="Флаг «На главной» решает, попадёт ли фото в блок галереи на главной." />
      {error ? <Alert severity="error">{error}</Alert> : null}
      <div className={styles.card}>
        {items.map((item, index) => (
          <div className={styles.row} key={item.id}>
            <img src={assetUrl(item.media.url)} alt="" width={72} height={54} style={{ objectFit: "cover", borderRadius: 8 }} />
            <div>
              <strong>{item.caption}</strong>
              <div>
                На главной
                <Switch
                  checked={item.showOnHome}
                  onChange={(event) => run(`/api/admin/gallery/${item.id}`, "PATCH", { showOnHome: event.target.checked })}
                />
              </div>
            </div>
            <span>
              <Button size="small" disabled={index === 0} onClick={() => run("/api/admin/gallery/order", "PATCH", { ids: moveItem(items, index, -1).map((photo) => photo.id) })}>
                Выше
              </Button>
              <Button size="small" color="error" onClick={() => run(`/api/admin/gallery/${item.id}`, "DELETE")}>
                Удалить
              </Button>
            </span>
          </div>
        ))}
        <h2>Новое фото</h2>
        <TextField fullWidth margin="dense" label="Подпись" value={caption} onChange={(event) => setCaption(event.target.value)} />
        <TextField fullWidth margin="dense" label="Текст, если фото не загрузилось" value={alt} onChange={(event) => setAlt(event.target.value)} />
        <MediaField label="Фото" value={mediaId} onChange={setMediaId} />
        <Button
          variant="contained"
          onClick={() =>
            run("/api/admin/gallery", "POST", {
              mediaId,
              caption,
              alt,
              height: 360,
            })
          }
        >
          Добавить фото
        </Button>
      </div>
    </>
  );
}
