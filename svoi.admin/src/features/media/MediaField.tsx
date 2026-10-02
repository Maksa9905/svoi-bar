import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api, assetUrl } from "@/shared/api";
import type { MediaAsset } from "@/shared/types";
import styles from "./MediaField.module.css";

export function MediaField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value?: string;
  onChange: (id: string | undefined) => void;
}) {
  const media = useQuery({
    queryKey: ["media"],
    queryFn: () => api<MediaAsset[]>("/api/admin/media"),
  });
  const selected = media.data?.find((item) => item.id === value);
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.field}>
      <span>{label}</span>
      {hint ? <small>{hint}</small> : null}
      <div className={styles.row}>
        {selected ? <img src={assetUrl(selected.url)} alt="" /> : <div className={styles.empty}>Нет картинки</div>}
        <Button variant="outlined" color="inherit" onClick={() => onChange(undefined)} disabled={!value}>
          Убрать
        </Button>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Выбрать
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Выберите картинку</DialogTitle>
        <DialogContent>
          <div className={styles.grid}>
            {(media.data ?? []).map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.card}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                <img src={assetUrl(item.url)} alt={item.alt} />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
