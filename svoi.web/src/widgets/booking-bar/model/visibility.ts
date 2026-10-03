export function bookingBarVisible(heroBottom: number | null): boolean {
  if (heroBottom === null) {
    return true;
  }

  return heroBottom <= 0;
}
