export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  const national = digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits;
  return `+7${national.slice(0, 10)}`;
}

export function formatPhone(input: string): string {
  const national = normalizePhone(input).slice(2);
  const chunks = [
    national.slice(0, 3),
    national.slice(3, 6),
    national.slice(6, 8),
    national.slice(8, 10),
  ].filter((chunk) => chunk.length > 0);

  return chunks.length > 0 ? `+7 ${chunks.join(" ")}` : "";
}

export function isCompletePhone(input: string): boolean {
  return /^\+7\d{10}$/.test(normalizePhone(input));
}
