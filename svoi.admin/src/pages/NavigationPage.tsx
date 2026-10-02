import { Alert, Button, Tab, Tabs, TextField } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, errorText } from "@/shared/api";
import { moveItem } from "@/shared/order";
import type { NavLink, Section } from "@/shared/types";
import { PageHeader } from "./PageHeader";
import styles from "./table.module.css";

export function NavigationPage() {
  const [place, setPlace] = useState<"header" | "footer">("header");
  const queryClient = useQueryClient();
  const links = useQuery({
    queryKey: ["nav", place],
    queryFn: () => api<NavLink[]>(`/api/admin/navigation?placement=${place}`),
  });
  const sections = useQuery({
    queryKey: ["sections"],
    queryFn: () => api<Section[]>("/api/admin/sections"),
  });
  const [label, setLabel] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [error, setError] = useState("");
  const rows = links.data ?? [];
  const anchored = (sections.data ?? []).filter((section) => section.anchor);

  const run = async (path: string, method: string, body?: unknown) => {
    try {
      setError("");
      await api(path, { method, body: body ? JSON.stringify(body) : undefined });
      queryClient.invalidateQueries({ queryKey: ["nav", place] });
    } catch (reason) {
      setError(errorText(reason));
    }
  };

  return (
    <>
      <PageHeader title="Навигация" lead="Шапка и подвал настраиваются отдельно." />
      <Tabs value={place} onChange={(_, value: "header" | "footer") => setPlace(value)}>
        <Tab value="header" label="Шапка" />
        <Tab value="footer" label="Подвал" />
      </Tabs>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <div className={styles.card}>
        {rows.map((link, index) => (
          <div className={styles.row} key={link.id}>
            <span>
              {link.label}
              {link.target.type === "broken" ? <small>Блок удалён</small> : null}
            </span>
            <span>
              <Button
                size="small"
                disabled={index === 0}
                onClick={() =>
                  run("/api/admin/navigation/order", "PATCH", {
                    placement: place,
                    ids: moveItem(rows, index, -1).map((item) => item.id),
                  })
                }
              >
                Выше
              </Button>
              <Button size="small" color="error" onClick={() => run(`/api/admin/navigation/${link.id}`, "DELETE")}>
                Удалить
              </Button>
            </span>
          </div>
        ))}
        <TextField fullWidth margin="dense" label="Текст пункта" value={label} onChange={(event) => setLabel(event.target.value)} />
        <TextField select fullWidth margin="dense" label="Блок на главной" value={sectionId} onChange={(event) => setSectionId(event.target.value)} SelectProps={{ native: true }} helperText="Только блоки с якорем">
          <option value="" />
          {anchored.map((section) => (
            <option key={section.id} value={section.id}>
              {section.anchor}
            </option>
          ))}
        </TextField>
        <div className={styles.toolbar}>
          <Button
            variant="contained"
            onClick={() => run("/api/admin/navigation", "POST", { placement: place, label, targetType: "section", sectionId })}
            disabled={!sectionId}
          >
            На блок
          </Button>
          <Button onClick={() => run("/api/admin/navigation", "POST", { placement: place, label, targetType: "page", pagePath: "/menu" })}>
            На меню
          </Button>
          <Button onClick={() => run("/api/admin/navigation", "POST", { placement: place, label, targetType: "page", pagePath: "/gallery" })}>
            На галерею
          </Button>
          <Button onClick={() => run("/api/admin/navigation", "POST", { placement: place, label, targetType: "action", action: "booking" })}>
            Открыть бронь
          </Button>
        </div>
      </div>
    </>
  );
}
