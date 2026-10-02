"use client";

import { useMutation } from "@tanstack/react-query";
import { bookingResponseSchema, type BookingRequest } from "@/entities/booking";
import { apiUrl } from "@/shared/config/api";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (input: BookingRequest) => {
      const response = await fetch(`${apiUrl()}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку");
      }

      return bookingResponseSchema.parse(payload);
    },
  });
}
