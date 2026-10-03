"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { useEffect, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { bookingRequestSchema, type BookingRequest } from "@/entities/booking";
import { useSite } from "@/entities/site";
import { formatPhone } from "@/shared/lib/phone";
import { uiStore } from "@/shared/model/ui-store";
import { Button } from "@/shared/ui/button/Button";
import { useCreateBooking } from "../api/use-create-booking";
import styles from "./BookingModal.module.css";

const defaultValues: BookingRequest = {
  guests: 4,
  date: "2026-10-12",
  time: "20:30",
  phone: "",
  name: "",
};

function openPickerFromLabel(event: MouseEvent<HTMLLabelElement>) {
  const input = event.currentTarget.querySelector("input");
  if (!(input instanceof HTMLInputElement) || event.target === input) {
    return;
  }
  if (typeof input.showPicker !== "function") {
    return;
  }

  event.preventDefault();
  try {
    input.showPicker();
  } catch {
    input.focus();
  }
}

function openNativePicker(event: MouseEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  if (typeof input.showPicker !== "function") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  try {
    input.showPicker();
  } catch {
    input.focus();
  }
}

function formatDisplayDate(value: string) {
  if (!value) {
    return "Выберите дату";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(new Date(`${value}T00:00:00`));
}

export const BookingModal = observer(function BookingModal() {
  const mutation = useCreateBooking();
  const site = useSite();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingRequest>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues,
  });

  const guests = watch("guests");
  const date = watch("date");
  const time = watch("time");
  const open = uiStore.bookingOpen;

  const resetMutation = mutation.reset;

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      resetMutation();
    }
  }, [open, reset, resetMutation]);

  if (!open) {
    return null;
  }

  const onSubmit = handleSubmit(async (values) => {
    const name = values.name?.trim();
    const result = await mutation.mutateAsync(name ? { ...values, name } : { ...values, name: undefined });
    uiStore.completeBooking(result.requestId);
  });

  return (
    <div className={styles.overlay} data-overlay="open">
      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        {uiStore.bookingRequestId ? (
          <div className={styles.success}>
            <img
              className={`${styles.successImage} ${styles.desktopSuccess}`}
              src="/images/success-desktop.png"
              alt=""
              width={260}
              height={270}
            />
            <img
              className={`${styles.successImage} ${styles.mobileSuccess}`}
              src="/images/success-mobile.png"
              alt=""
              width={230}
              height={250}
            />
            <h2 className={styles.successTitle}>ГОТОВО.</h2>
            <p className={styles.successText}>
              Заявка отправлена. Скоро свяжемся с вами для подтверждения.
            </p>
            <Button variant="lime" onClick={() => uiStore.closeBooking()}>
              ВЕРНУТЬСЯ НА САЙТ
            </Button>
            <p className={styles.requestId}>ЗАЯВКА #{uiStore.bookingRequestId}</p>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.copy}>
                <p className={styles.eyebrow}>БРОНИРОВАНИЕ</p>
                <h2 id="booking-title" className={styles.title}>
                  ЗАБРОНИРОВАТЬ СТОЛ
                </h2>
                <p className={styles.lead}>Оставьте номер — свяжемся и всё подтвердим.</p>
              </div>
              <button
                type="button"
                className={styles.close}
                aria-label="Закрыть"
                onClick={() => uiStore.closeBooking()}
              >
                <img src="/icons/x.svg" alt="" width={20} height={20} />
              </button>
            </div>

            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <div className={styles.field}>
                <span className={styles.label}>СКОЛЬКО ВАС?</span>
                <div className={styles.counter}>
                  <button
                    type="button"
                    className={styles.step}
                    aria-label="Меньше гостей"
                    onClick={() => setValue("guests", Math.max(1, guests - 1))}
                  >
                    −
                  </button>
                  <span className={styles.count}>{guests}</span>
                  <button
                    type="button"
                    className={`${styles.step} ${styles.stepPlus}`}
                    aria-label="Больше гостей"
                    onClick={() => setValue("guests", Math.min(12, guests + 1))}
                  >
                    +
                  </button>
                </div>
                <input type="hidden" {...register("guests", { valueAsNumber: true })} />
                {errors.guests ? <span className={styles.error}>{errors.guests.message}</span> : null}
              </div>

              <div className={styles.row}>
                <label className={styles.field} onClick={openPickerFromLabel}>
                  <span className={styles.label}>КОГДА?</span>
                  <span className={`${styles.control} ${styles.dateWrap}`}>
                    <span className={styles.value}>{formatDisplayDate(date)}</span>
                    <img src="/icons/calendar.svg" alt="" width={18} height={18} />
                    <input
                      className={styles.native}
                      type="date"
                      aria-label="Дата"
                      {...register("date")}
                      onClick={openNativePicker}
                    />
                  </span>
                  {errors.date ? <span className={styles.error}>{errors.date.message}</span> : null}
                </label>
                <label className={styles.field} onClick={openPickerFromLabel}>
                  <span className={styles.label}>ВО СКОЛЬКО?</span>
                  <span className={`${styles.control} ${styles.timeWrap}`}>
                    <span className={styles.value}>{time || "Выберите время"}</span>
                    <img src="/icons/clock.svg" alt="" width={18} height={18} />
                    <input
                      className={styles.native}
                      type="time"
                      aria-label="Время"
                      {...register("time")}
                      onClick={openNativePicker}
                    />
                  </span>
                  {errors.time ? <span className={styles.error}>{errors.time.message}</span> : null}
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>ИМЯ ДЛЯ БРОНИ</span>
                <span className={styles.control}>
                  <input
                    className={styles.input}
                    autoComplete="name"
                    placeholder="Введите имя..."
                    maxLength={40}
                    aria-label="Имя для брони"
                    {...register("name")}
                  />
                </span>
                {errors.name ? <span className={styles.error}>{errors.name.message}</span> : null}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>ТЕЛЕФОН</span>
                <span className={styles.control}>
                  <input
                    className={styles.input}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 ___ ___ __ __"
                    aria-label="Телефон"
                    {...register("phone", {
                      onChange: (event) => {
                        setValue("phone", formatPhone(event.target.value), {
                          shouldValidate: false,
                        });
                      },
                    })}
                  />
                  <img src="/icons/phone.svg" alt="" width={18} height={18} />
                </span>
                {errors.phone ? <span className={styles.error}>{errors.phone.message}</span> : null}
              </label>

              <Button type="submit" variant="lime" full disabled={mutation.isPending}>
                {mutation.isPending ? "ОТПРАВЛЯЕМ..." : "ЗАБРОНИРОВАТЬ"}
              </Button>
              {mutation.isError ? (
                <p className={styles.error}>Не удалось отправить заявку. Попробуйте ещё раз.</p>
              ) : null}
              <p className={styles.consent}>
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>

            <div className={styles.note}>
              <img src="/icons/phone-note.svg" alt="" width={20} height={20} />
              <p>Или позвоните по номеру {site.data?.venue?.phone ?? ""}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
