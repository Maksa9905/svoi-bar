import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';

@Module({
  imports: [AuthModule],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
