import { Injectable } from '@nestjs/common';
import { collectMediaIds } from '../common/media-ids';
import { GalleryService } from '../gallery/gallery.service';
import { MediaService } from '../media/media.service';
import { MenuService } from '../menu/menu.service';
import { presentNavLink } from '../navigation/present-nav';
import { PrismaService } from '../prisma/prisma.service';
import { VenueService } from '../venue/venue.service';

@Injectable()
export class SiteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
    private readonly menu: MenuService,
    private readonly gallery: GalleryService,
    private readonly venue: VenueService,
  ) {}

  async get() {
    const [sections, links, venue, menu, gallery] = await Promise.all([
      this.prisma.section.findMany({
        where: { page: 'home' },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.navLink.findMany({
        orderBy: [{ placement: 'asc' }, { sortOrder: 'asc' }],
      }),
      this.venue.get().catch(() => null),
      this.menu.catalog(),
      this.gallery.list(),
    ]);

    const sectionMap = new Map(
      sections.map((section) => [section.id, section]),
    );
    const header = links
      .filter((link) => link.placement === 'header')
      .map((link) => presentNavLink(link, sectionMap));
    const footer = links
      .filter((link) => link.placement === 'footer')
      .map((link) => presentNavLink(link, sectionMap));

    const mediaIds = sections.flatMap((section) => [
      ...collectMediaIds(section.payload),
    ]);
    const media = await this.media.mapByIds(mediaIds);

    return {
      venue,
      header,
      footer,
      sections: sections.map((section) => ({
        id: section.id,
        type: section.type,
        anchor: section.anchor,
        sortOrder: section.sortOrder,
        payload: section.payload,
      })),
      media,
      menu,
      gallery: {
        items: gallery,
        home: gallery
          .filter((item) => item.showOnHome)
          .sort(
            (left, right) =>
              (left.homeSortOrder ?? 0) - (right.homeSortOrder ?? 0),
          ),
      },
    };
  }
}
