import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { z } from 'zod';
import { AdminGuard } from '../auth/admin.guard';
import { ZodPipe } from '../common/zod.pipe';
import {
  bookingStatuses,
  createBookingSchema,
  updateBookingSchema,
} from './booking.schema';
import { BookingsService } from './bookings.service';

@Controller()
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post('bookings')
  create(
    @Body(new ZodPipe(createBookingSchema))
    body: z.infer<typeof createBookingSchema>,
  ) {
    return this.bookings.create(body);
  }

  @Get('admin/bookings')
  @UseGuards(AdminGuard)
  list(@Query('status') status?: string) {
    if (!status) {
      return this.bookings.list();
    }
    const parsed = bookingStatuses.find((item) => item === status);
    if (!parsed) {
      throw new BadRequestException('Неизвестный статус');
    }
    return this.bookings.list(parsed);
  }

  @Patch('admin/bookings/:id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(updateBookingSchema))
    body: z.infer<typeof updateBookingSchema>,
  ) {
    return this.bookings.updateStatus(id, body.status);
  }
}
