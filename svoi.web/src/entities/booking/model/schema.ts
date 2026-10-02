import { z } from "zod";
import { isCompletePhone, normalizePhone } from "@/shared/lib/phone";

export const bookingRequestSchema = z.object({
  guests: z.number().int().min(1, "Минимум 1 гость").max(12, "Максимум 12 гостей"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Выберите дату"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Выберите время"),
  phone: z
    .string()
    .refine(isCompletePhone, "Введите номер телефона")
    .transform(normalizePhone),
  name: z.string().trim().max(40, "Имя слишком длинное").optional(),
});

export const bookingResponseSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  phone: z.string(),
  guests: z.number(),
  date: z.string(),
  time: z.string(),
  name: z.string().nullable(),
  comment: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
});

export type BookingRequest = z.input<typeof bookingRequestSchema>;
export type BookingPayload = z.output<typeof bookingRequestSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
