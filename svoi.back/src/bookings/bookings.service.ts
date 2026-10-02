import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { bookingStatuses, type BookingStatusName } from './booking.schema';

const toDb: Record<BookingStatusName, BookingStatus> = {
  new: BookingStatus.NEW,
  confirmed: BookingStatus.CONFIRMED,
  cancelled: BookingStatus.CANCELLED,
  no_show: BookingStatus.NO_SHOW,
};

const fromDb = Object.fromEntries(
  bookingStatuses.map((status) => [toDb[status], status]),
) as Record<BookingStatus, BookingStatusName>;

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: {
    guests: number;
    date: string;
    time: string;
    phone: string;
    name?: string;
    comment?: string;
  }) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const requestId = `SV-${String(1000 + Math.floor(Math.random() * 9000))}`;
      try {
        const booking = await this.prisma.booking.create({
          data: { ...input, requestId, status: BookingStatus.NEW },
        });
        return this.present(booking);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }

    throw new ConflictException('Не удалось выдать номер заявки');
  }

  async list(status?: BookingStatusName) {
    const rows = await this.prisma.booking.findMany({
      where: status ? { status: toDb[status] } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.present(row));
  }

  async updateStatus(id: string, status: BookingStatusName) {
    const current = await this.prisma.booking.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException('Заявка не найдена');
    }
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status: toDb[status] },
    });
    return this.present(booking);
  }

  private present(booking: {
    id: string;
    requestId: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    name: string | null;
    comment: string | null;
    status: BookingStatus;
    createdAt: Date;
  }) {
    return {
      id: booking.id,
      requestId: booking.requestId,
      phone: booking.phone,
      guests: booking.guests,
      date: booking.date,
      time: booking.time,
      name: booking.name,
      comment: booking.comment,
      status: fromDb[booking.status],
      createdAt: booking.createdAt,
    };
  }
}
