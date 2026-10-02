import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { collectMediaIds } from '../common/media-ids';
import { PrismaService } from '../prisma/prisma.service';
import {
  MEDIA_STORAGE,
  type MediaStorage,
  type StoredFile,
} from './media-storage';
import { mediaPublicUrl } from './media-url';

const allowedMime = /^image\/(jpeg|png|webp|gif|svg\+xml)$/;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(MEDIA_STORAGE) private readonly storage: MediaStorage,
  ) {}

  async upload(file: StoredFile | undefined, alt = '') {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }
    if (!allowedMime.test(file.mimeType)) {
      throw new BadRequestException(
        'Нужна картинка jpeg, png, webp, gif или svg',
      );
    }

    const stored = await this.storage.save(file);
    const media = await this.prisma.media.create({
      data: {
        storageKey: stored.storageKey,
        mimeType: file.mimeType,
        alt,
      },
    });

    return this.present(media);
  }

  async list() {
    const rows = await this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.present(row));
  }

  async assertExists(ids: string[]) {
    const unique = [...new Set(ids)];
    if (unique.length === 0) {
      return;
    }

    const count = await this.prisma.media.count({
      where: { id: { in: unique } },
    });
    if (count !== unique.length) {
      throw new BadRequestException('В секции указана несуществующая картинка');
    }
  }

  async open(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media || media.storageKey.startsWith('/')) {
      throw new NotFoundException('Файл не найден');
    }

    const buffer = await this.storage.read(media.storageKey);
    return { buffer, mimeType: media.mimeType };
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException('Картинка не найдена');
    }

    const [menuCount, galleryCount, sections] = await Promise.all([
      this.prisma.menuItem.count({ where: { mediaId: id } }),
      this.prisma.galleryItem.count({
        where: { OR: [{ mediaId: id }, { mascotMediaId: id }] },
      }),
      this.prisma.section.findMany({ select: { payload: true } }),
    ]);

    const usedInSection = sections.some((section) =>
      collectMediaIds(section.payload).has(id),
    );
    if (menuCount > 0 || galleryCount > 0 || usedInSection) {
      throw new ConflictException('Картинка используется в контенте');
    }

    await this.prisma.media.delete({ where: { id } });
    if (!media.storageKey.startsWith('/')) {
      await this.storage.remove(media.storageKey);
    }
  }

  present(media: {
    id: string;
    storageKey: string;
    mimeType: string;
    alt: string;
  }) {
    return {
      id: media.id,
      alt: media.alt,
      mimeType: media.mimeType,
      url: mediaPublicUrl(media.id, media.storageKey),
    };
  }

  async mapByIds(ids: string[]) {
    const unique = [...new Set(ids)];
    if (unique.length === 0) {
      return {};
    }

    const rows = await this.prisma.media.findMany({
      where: { id: { in: unique } },
    });
    return Object.fromEntries(rows.map((row) => [row.id, this.present(row)]));
  }
}
