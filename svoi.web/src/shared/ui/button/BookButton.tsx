"use client";

import type { ReactNode } from "react";
import { uiStore } from "@/shared/model/ui-store";
import { Button } from "./Button";

type BookButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "lime" | "dark" | "yellow";
  size?: "md" | "sm";
  full?: boolean;
};

export function BookButton({ children, variant = "primary", size, full }: BookButtonProps) {
  return (
    <Button variant={variant} size={size} full={full} onClick={() => uiStore.openBooking()}>
      {children}
    </Button>
  );
}
