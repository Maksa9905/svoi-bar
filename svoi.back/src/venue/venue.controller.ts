import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { AdminGuard } from '../auth/admin.guard';
import { ZodPipe } from '../common/zod.pipe';
import { VenueService } from './venue.service';

const venueSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  descriptor: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  hours: z.string().min(1),
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  legal: z.string().min(1),
});

@Controller('admin/venue')
@UseGuards(AdminGuard)
export class VenueController {
  constructor(private readonly venue: VenueService) {}

  @Get()
  get() {
    return this.venue.get();
  }

  @Patch()
  update(
    @Body(new ZodPipe(venueSchema.partial()))
    body: z.infer<ReturnType<typeof venueSchema.partial>>,
  ) {
    return this.venue.update(body);
  }
}
