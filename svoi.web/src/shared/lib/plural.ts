export function formatPositionCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = "ПОЗИЦИЙ";

  if (mod10 === 1 && mod100 !== 11) {
    word = "ПОЗИЦИЯ";
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    word = "ПОЗИЦИИ";
  }

  return `${String(count).padStart(2, "0")} ${word}`;
}
