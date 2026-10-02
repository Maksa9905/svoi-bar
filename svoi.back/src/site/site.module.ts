import { Module } from '@nestjs/common';
import { GalleryModule } from '../gallery/gallery.module';
import { MediaModule } from '../media/media.module';
import { MenuModule } from '../menu/menu.module';
import { VenueModule } from '../venue/venue.module';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [MediaModule, MenuModule, GalleryModule, VenueModule],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
