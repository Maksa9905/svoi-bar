import { Alert, Button } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, assetUrl, errorText } from "@/shared/api";
import type { MediaAsset } from "@/shared/types";
import { PageHeader } from "./PageHeader";
import styles from "./MediaPage.module.css";

export function MediaPage() {
  const queryClient = useQueryClient();
  const media = useQuery({
    queryKey: ["media"],
    queryFn: () => api<MediaAsset[]>("/api/admin/media"),
  });
  const [error, setError] = useState("");

  return (
    <>
      <PageHeader title="Медиа" lead="Картинки, которые можно поставить в блоки, меню и галерею." />
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Button variant="contained" component="label">
        Загрузить
        <input
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            const body = new FormData();
            body.append("file", file);
            void api("/api/admin/media", { method: "POST", body })
              .then(() => queryClient.invalidateQueries({ queryKey: ["media"] }))
              .catch((reason: unknown) => setError(errorText(reason)));
          }}
        />
      </Button>
      {media.data?.length === 0 ? <p>Картинок пока нет.</p> : null}
      <div className={styles.grid}>
        {(media.data ?? []).map((item) => (
          <article key={item.id} className={styles.card}>
            <img src={assetUrl(item.url)} alt={item.alt} />
            <Button
              size="small"
              color="error"
              onClick={() => {
                void api(`/api/admin/media/${item.id}`, { method: "DELETE" })
                  .then(() => queryClient.invalidateQueries({ queryKey: ["media"] }))
                  .catch((reason: unknown) => setError(errorText(reason)));
              }}
            >
              Удалить
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
