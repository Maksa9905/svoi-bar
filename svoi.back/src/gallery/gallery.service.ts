import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';

type GalleryInput = {
  mediaId: string;
  caption: string;
  alt: string;
  height: number;
  showOnHome?: boolean;
  mascotMediaId?: string | null;
  mascotSide?: 'left' | 'right' | 'top' | null;
};

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  async list() {
    const items = await this.prisma.galleryItem.findMany({
      include: { media: true, mascot: true },
      orderBy: { sortOrder: 'asc' },
    });
    return items.map((item) => this.present(item));
  }

  async create(input: GalleryInput) {
    await this.assertMedia(input);
    const last = await this.prisma.galleryItem.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    const homeSortOrder = input.showOnHome ? await this.nextHomeOrder() : null;
    const item = await this.prisma.galleryItem.create({
      data: {
        mediaId: input.mediaId,
        caption: input.caption,
        alt: input.alt,
        height: input.height,
        showOnHome: input.showOnHome ?? false,
        homeSortOrder,
        mascotMediaId: input.mascotMediaId ?? null,
        mascotSide: input.mascotSide ?? null,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
      include: { media: true, mascot: true },
    });
    return this.present(item);
  }

  async update(id: string, input: Partial<GalleryInput>) {
    const current = await this.prisma.galleryItem.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException('Фото не найдено');
    }
    await this.assertMedia({
      mediaId: input.mediaId ?? current.mediaId,
      mascotMediaId:
        input.mascotMediaId === undefined
          ? current.mascotMediaId
          : input.mascotMediaId,
    });

    let homeSortOrder = current.homeSortOrder;
    if (input.showOnHome === true && !current.showOnHome) {
      homeSortOrder = await this.nextHomeOrder();
    }
    if (input.showOnHome === false) {
      homeSortOrder = null;
    }

    const item = await this.prisma.galleryItem.update({
      where: { id },
      data: {
        mediaId: input.mediaId,
        caption: input.caption,
        alt: input.alt,
        height: input.height,
        showOnHome: input.showOnHome,
        homeSortOrder,
        mascotMediaId: input.mascotMediaId,
        mascotSide: input.mascotSide,
      },
      include: { media: true, mascot: true },
    });
    return this.present(item);
  }

  async remove(id: string) {
    const current = await this.prisma.galleryItem.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException('Фото не найдено');
    }
    await this.prisma.galleryItem.delete({ where: { id } });
  }

  async reorder(ids: string[]) {
    const existing = await this.prisma.galleryItem.findMany();
    const existingIds = new Set(existing.map((item) => item.id));
    if (
      ids.length !== existing.length ||
      ids.some((id) => !existingIds.has(id))
    ) {
      throw new BadRequestException(
        'Передайте все фото галереи ровно один раз',
      );
    }
    await this.prisma.$transaction(
      ids.map((id, sortOrder) =>
        this.prisma.galleryItem.update({ where: { id }, data: { sortOrder } }),
      ),
    );
    return this.list();
  }

  private async assertMedia(input: {
    mediaId: string;
    mascotMediaId?: string | null;
  }) {
    const ids = [input.mediaId, input.mascotMediaId].filter(
      (id): id is string => Boolean(id),
    );
    await this.media.assertExists(ids);
  }

  private async nextHomeOrder() {
    const last = await this.prisma.galleryItem.findFirst({
      where: { showOnHome: true },
      orderBy: { homeSortOrder: 'desc' },
    });
    return (last?.homeSortOrder ?? -1) + 1;
  }

  private present(item: {
    id: string;
    caption: string;
    alt: string;
    height: number;
    sortOrder: number;
    showOnHome: boolean;
    homeSortOrder: number | null;
    mascotSide: string | null;
    media: { id: string; storageKey: string; mimeType: string; alt: string };
    mascot: {
      id: string;
      storageKey: string;
      mimeType: string;
      alt: string;
    } | null;
  }) {
    return {
      id: item.id,
      caption: item.caption,
      alt: item.alt,
      height: item.height,
      sortOrder: item.sortOrder,
      showOnHome: item.showOnHome,
      homeSortOrder: item.homeSortOrder,
      mascotSide: item.mascotSide,
      media: this.media.present(item.media),
      mascot: item.mascot ? this.media.present(item.mascot) : null,
    };
  }
}
