export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const national =
    digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  return `+7${national.slice(0, 10)}`;
}
