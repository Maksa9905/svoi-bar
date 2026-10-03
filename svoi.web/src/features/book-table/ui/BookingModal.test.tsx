import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    cleanup();
    uiStore.reset();
    uiStore.openBooking();
  });

  it("показывает ошибку, если телефон не заполнен", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "ЗАБРОНИРОВАТЬ" }));

    expect(await screen.findByText("Введите номер телефона")).toBeInTheDocument();
  });

  it("открывает календарь и время по клику на всё поле", async () => {
    const user = userEvent.setup();
    renderModal();

    const date = screen.getByLabelText("Дата");
    const time = screen.getByLabelText("Время");
    const showDate = vi.fn();
    const showTime = vi.fn();
    date.showPicker = showDate;
    time.showPicker = showTime;

    await user.click(date);
    await user.click(time);
    await user.click(screen.getByText("КОГДА?"));
    await user.click(screen.getByText("ВО СКОЛЬКО?"));

    expect(showDate).toHaveBeenCalledTimes(2);
    expect(showTime).toHaveBeenCalledTimes(2);
  });
});
