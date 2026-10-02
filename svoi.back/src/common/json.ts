import { Prisma } from '@prisma/client';

export function jsonPayload(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
