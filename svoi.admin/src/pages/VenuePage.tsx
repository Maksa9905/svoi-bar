import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api, errorText } from "@/shared/api";
import { parseCoordinate } from "@/shared/coordinate";
import type { Venue } from "@/shared/types";
import { PageHeader } from "./PageHeader";

const coordinate = z.string().refine((value) => parseCoordinate(value) !== null, "Введите число");

const schema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  descriptor: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  hours: z.string().min(1),
  lat: coordinate,
  lon: coordinate,
  legal: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function VenuePage() {
  const venue = useQuery({
    queryKey: ["venue"],
    queryFn: () => api<Venue>("/api/admin/venue"),
  });
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (venue.data) {
      form.reset({
        ...venue.data,
        lat: String(venue.data.lat),
        lon: String(venue.data.lon),
      });
    }
  }, [venue.data, form]);

  return (
    <>
      <PageHeader title="Заведение" lead="Эти данные видны в контактах, подвале и на карте." />
      {venue.isError ? <Alert severity="error">{errorText(venue.error)}</Alert> : null}
      <form
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setError("");
            await api("/api/admin/venue", {
              method: "PATCH",
              body: JSON.stringify({
                ...values,
                lat: parseCoordinate(values.lat),
                lon: parseCoordinate(values.lon),
              }),
            });
            setSaved(true);
          } catch (reason) {
            setError(errorText(reason));
          }
        })}
      >
        {(
          [
            ["name", "Название"],
            ["city", "Город"],
            ["descriptor", "Короткая подпись"],
            ["phone", "Телефон"],
            ["address", "Адрес"],
            ["hours", "Часы работы"],
            ["legal", "Юридическая строка"],
          ] as const
        ).map(([name, label]) => (
          <TextField key={name} fullWidth margin="normal" label={label} {...form.register(name)} />
        ))}
        <TextField
          fullWidth
          margin="normal"
          label="Широта"
          inputMode="decimal"
          helperText={form.formState.errors.lat?.message ?? "Точка на карте. Можно с точкой или запятой"}
          {...form.register("lat")}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Долгота"
          inputMode="decimal"
          helperText={form.formState.errors.lon?.message}
          {...form.register("lon")}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Button type="submit" variant="contained">
          Сохранить
        </Button>
      </form>
      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Сохранено. На сайте уже новое." />
    </>
  );
}
