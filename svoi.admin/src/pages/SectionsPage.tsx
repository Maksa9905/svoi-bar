import { Alert, Button, Dialog, DialogActions, DialogTitle, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, errorText } from "@/shared/api";
import { blockTitle, sectionTypeLabels } from "@/shared/labels";
import { moveItem } from "@/shared/order";
import type { Section } from "@/shared/types";
import { PageHeader } from "./PageHeader";
import styles from "./table.module.css";

export function SectionsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sections = useQuery({
    queryKey: ["sections"],
    queryFn: () => api<Section[]>("/api/admin/sections"),
  });
  const types = useQuery({
    queryKey: ["section-types"],
    queryFn: () => api<string[]>("/api/admin/sections/types"),
  });
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Section | null>(null);

  const reorder = useMutation({
    mutationFn: (ids: string[]) =>
      api("/api/admin/sections/order", { method: "PATCH", body: JSON.stringify({ ids }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sections"] }),
  });
  const create = useMutation({
    mutationFn: (type: string) =>
      api<Section>("/api/admin/sections", { method: "POST", body: JSON.stringify({ type }) }),
    onSuccess: (section) => {
      setAdding(false);
      navigate(`/sections/${section.id}`);
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/admin/sections/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setRemoving(null);
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });

  const rows = sections.data ?? [];

  return (
    <>
      <PageHeader title="Главная" lead="Порядок блоков сверху вниз — как на сайте." />
      <div className={styles.toolbar}>
        <Button variant="contained" onClick={() => setAdding(true)}>
          Добавить блок
        </Button>
      </div>
      {sections.isPending ? <Skeleton height={240} /> : null}
      {sections.isError ? <Alert severity="error">{errorText(sections.error)}</Alert> : null}
      <div className={styles.card}>
        <div className={styles.list}>
          {rows.map((section, index) => (
            <div className={styles.row} key={section.id}>
              <div>
                <strong>{sectionTypeLabels[section.type] ?? section.type}</strong>
                <div>{blockTitle(section.payload)}</div>
                {section.anchor ? <small>Якорь: {section.anchor}</small> : null}
              </div>
              <div className={styles.toolbar}>
                <Button
                  size="small"
                  onClick={() => reorder.mutate(moveItem(rows, index, -1).map((item) => item.id))}
                  disabled={index === 0}
                >
                  Выше
                </Button>
                <Button
                  size="small"
                  onClick={() => reorder.mutate(moveItem(rows, index, 1).map((item) => item.id))}
                  disabled={index === rows.length - 1}
                >
                  Ниже
                </Button>
                <Button size="small" onClick={() => navigate(`/sections/${section.id}`)}>
                  Открыть
                </Button>
                <Button size="small" color="error" onClick={() => setRemoving(section)}>
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={adding} onClose={() => setAdding(false)}>
        <DialogTitle>Какой блок добавить?</DialogTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          {(types.data ?? []).map((type) => (
            <Button key={type} onClick={() => create.mutate(type)}>
              {sectionTypeLabels[type] ?? type}
            </Button>
          ))}
        </div>
      </Dialog>
      <Dialog open={Boolean(removing)} onClose={() => setRemoving(null)}>
        <DialogTitle>Удалить блок? Пункты меню, которые на него ссылались, перестанут вести.</DialogTitle>
        <DialogActions>
          <Button onClick={() => setRemoving(null)}>Отмена</Button>
          <Button color="error" onClick={() => removing && remove.mutate(removing.id)}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      {reorder.isError || create.isError || remove.isError ? (
        <Alert severity="error">{errorText(reorder.error ?? create.error ?? remove.error)}</Alert>
      ) : null}
    </>
  );
}
