import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { uiStore } from "@/shared/model/ui-store";
import { BookingModal } from "./BookingModal";

function renderModal() {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <BookingModal />
    </QueryClientProvider>,
  );
}

describe("BookingModal", () => {
  beforeEach(() => {
    uiStore.reset();
    uiStore.openBooking();
  });

  it("показывает ошибку, если телефон не заполнен", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "ЗАБРОНИРОВАТЬ" }));

    expect(await screen.findByText("Введите номер телефона")).toBeInTheDocument();
  });
});
