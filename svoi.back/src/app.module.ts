import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { GalleryModule } from './gallery/gallery.module';
import { HealthController } from './health.controller';
import { MediaModule } from './media/media.module';
import { MenuModule } from './menu/menu.module';
import { NavigationModule } from './navigation/navigation.module';
import { PrismaModule } from './prisma/prisma.module';
import { SectionsModule } from './sections/sections.module';
import { SiteModule } from './site/site.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MediaModule,
    SectionsModule,
    NavigationModule,
    MenuModule,
    GalleryModule,
    VenueModule,
    BookingsModule,
    SiteModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
