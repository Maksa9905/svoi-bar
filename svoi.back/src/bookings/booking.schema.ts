import { z } from 'zod';
import { normalizePhone } from '../common/phone';

export const bookingStatuses = [
  'new',
  'confirmed',
  'cancelled',
  'no_show',
] as const;
export type BookingStatusName = (typeof bookingStatuses)[number];

export const createBookingSchema = z.object({
  guests: z.number().int().min(1).max(12),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  phone: z
    .string()
    .transform(normalizePhone)
    .pipe(z.string().regex(/^\+7\d{10}$/, 'Введите номер телефона')),
  name: z.string().trim().max(40).optional(),
  comment: z.string().trim().max(500).optional(),
});

export const updateBookingSchema = z.object({
  status: z.enum(bookingStatuses),
});
