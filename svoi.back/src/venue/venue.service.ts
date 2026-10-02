import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type VenueInput = {
  name: string;
  city: string;
  descriptor: string;
  phone: string;
  address: string;
  hours: string;
  lat: number;
  lon: number;
  legal: string;
};

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const venue = await this.prisma.venue.findUnique({
      where: { id: 'venue' },
    });
    if (!venue) {
      throw new NotFoundException('Карточка заведения не заполнена');
    }
    return venue;
  }

  async update(input: Partial<VenueInput>) {
    const current = await this.prisma.venue.findUnique({
      where: { id: 'venue' },
    });
    if (!current) {
      throw new NotFoundException('Карточка заведения не заполнена');
    }
    return this.prisma.venue.update({ where: { id: 'venue' }, data: input });
  }
}
