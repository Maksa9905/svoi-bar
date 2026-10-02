import { Alert, Chip, MenuItem, Select, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, errorText } from "@/shared/api";
import { bookingStatusLabels } from "@/shared/labels";
import type { Booking } from "@/shared/types";
import { PageHeader } from "./PageHeader";
import styles from "./table.module.css";

const filters = ["", "new", "confirmed", "cancelled", "no_show"] as const;

export function BookingsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<(typeof filters)[number]>("");
  const bookings = useQuery({
    queryKey: ["bookings", status],
    queryFn: () => api<Booking[]>(status ? `/api/admin/bookings?status=${status}` : "/api/admin/bookings"),
  });
  const update = useMutation({
    mutationFn: (input: { id: string; status: string }) =>
      api(`/api/admin/bookings/${input.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: input.status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  return (
    <>
      <PageHeader title="Заявки" lead="Здесь меняется только статус. Дата и телефон приходят с сайта." />
      <div className={styles.chips}>
        {filters.map((item) => (
          <Chip
            key={item || "all"}
            label={item ? bookingStatusLabels[item] : "Все"}
            color={status === item ? "primary" : "default"}
            onClick={() => setStatus(item)}
          />
        ))}
      </div>
      {bookings.isPending ? <Skeleton height={240} /> : null}
      {bookings.isError ? <Alert severity="error">{errorText(bookings.error)}</Alert> : null}
      {bookings.data?.length === 0 ? <p>Заявок пока нет.</p> : null}
      {bookings.data && bookings.data.length > 0 ? (
        <div className={styles.wrap}>
          <table>
            <thead>
              <tr>
                <th>Визит</th>
                <th>Гости</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {bookings.data.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    {booking.date} {booking.time}
                    {booking.comment ? <small>{booking.comment}</small> : null}
                  </td>
                  <td>{booking.guests}</td>
                  <td>{booking.name || "—"}</td>
                  <td>{booking.phone}</td>
                  <td>
                    <Select
                      size="small"
                      value={booking.status}
                      onChange={(event) => update.mutate({ id: booking.id, status: event.target.value })}
                    >
                      {Object.entries(bookingStatusLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {update.isError ? <Alert severity="error">{errorText(update.error)}</Alert> : null}
    </>
  );
}
