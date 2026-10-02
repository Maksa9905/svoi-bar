import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';

const itemInclude = {
  filter: true,
  group: true,
  media: true,
} satisfies Prisma.MenuItemInclude;

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  async catalog() {
    const [filters, groups, items] = await Promise.all([
      this.prisma.menuFilter.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.menuGroup.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.menuItem.findMany({
        include: itemInclude,
        orderBy: [{ group: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      }),
    ]);

    return {
      filters,
      groups,
      items: items.map((item) => this.presentItem(item)),
    };
  }

  async createFilter(input: { slug: string; label: string }) {
    const last = await this.prisma.menuFilter.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    try {
      return await this.prisma.menuFilter.create({
        data: { ...input, sortOrder: (last?.sortOrder ?? -1) + 1 },
      });
    } catch (error) {
      this.rethrowUnique(error, 'Такой фильтр уже есть');
    }
  }

  async updateFilter(id: string, input: { slug?: string; label?: string }) {
    await this.ensureFilter(id);
    try {
      return await this.prisma.menuFilter.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      this.rethrowUnique(error, 'Такой фильтр уже есть');
    }
  }

  async removeFilter(id: string) {
    await this.ensureFilter(id);
    const used = await this.prisma.menuItem.count({ where: { filterId: id } });
    if (used > 0) {
      throw new ConflictException('В фильтре есть позиции');
    }
    await this.prisma.menuFilter.delete({ where: { id } });
  }

  async reorderFilters(ids: string[]) {
    await this.reorder(
      ids,
      () => this.prisma.menuFilter.findMany(),
      (id, sortOrder) =>
        this.prisma.menuFilter.update({ where: { id }, data: { sortOrder } }),
    );
    return this.prisma.menuFilter.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createGroup(input: { title: string }) {
    const last = await this.prisma.menuGroup.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    return this.prisma.menuGroup.create({
      data: { title: input.title, sortOrder: (last?.sortOrder ?? -1) + 1 },
    });
  }

  async updateGroup(id: string, input: { title: string }) {
    await this.ensureGroup(id);
    return this.prisma.menuGroup.update({ where: { id }, data: input });
  }

  async removeGroup(id: string) {
    await this.ensureGroup(id);
    const used = await this.prisma.menuItem.count({ where: { groupId: id } });
    if (used > 0) {
      throw new ConflictException('В классификации есть позиции');
    }
    await this.prisma.menuGroup.delete({ where: { id } });
  }

  async reorderGroups(ids: string[]) {
    await this.reorder(
      ids,
      () => this.prisma.menuGroup.findMany(),
      (id, sortOrder) =>
        this.prisma.menuGroup.update({ where: { id }, data: { sortOrder } }),
    );
    return this.prisma.menuGroup.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createItem(input: {
    filterId: string;
    groupId: string;
    mediaId: string;
    title: string;
    description: string;
    price: string;
    accent: string;
    alt: string;
  }) {
    await this.ensureFilter(input.filterId);
    await this.ensureGroup(input.groupId);
    await this.media.assertExists([input.mediaId]);
    const last = await this.prisma.menuItem.findFirst({
      where: { groupId: input.groupId },
      orderBy: { sortOrder: 'desc' },
    });
    const item = await this.prisma.menuItem.create({
      data: { ...input, sortOrder: (last?.sortOrder ?? -1) + 1 },
      include: itemInclude,
    });
    return this.presentItem(item);
  }

  async updateItem(
    id: string,
    input: Partial<{
      filterId: string;
      groupId: string;
      mediaId: string;
      title: string;
      description: string;
      price: string;
      accent: string;
      alt: string;
    }>,
  ) {
    await this.ensureItem(id);
    if (input.filterId) {
      await this.ensureFilter(input.filterId);
    }
    if (input.groupId) {
      await this.ensureGroup(input.groupId);
    }
    if (input.mediaId) {
      await this.media.assertExists([input.mediaId]);
    }
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: input,
      include: itemInclude,
    });
    return this.presentItem(item);
  }

  async removeItem(id: string) {
    await this.ensureItem(id);
    await this.prisma.menuItem.delete({ where: { id } });
  }

  async reorderItems(groupId: string, ids: string[]) {
    await this.ensureGroup(groupId);
    const existing = await this.prisma.menuItem.findMany({
      where: { groupId },
    });
    const existingIds = new Set(existing.map((item) => item.id));
    if (
      ids.length !== existing.length ||
      ids.some((id) => !existingIds.has(id))
    ) {
      throw new BadRequestException(
        'Передайте все позиции этой классификации ровно один раз',
      );
    }
    await this.prisma.$transaction(
      ids.map((id, sortOrder) =>
        this.prisma.menuItem.update({ where: { id }, data: { sortOrder } }),
      ),
    );
    return this.catalog();
  }

  private presentItem(
    item: Prisma.MenuItemGetPayload<{ include: typeof itemInclude }>,
  ) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      accent: item.accent,
      alt: item.alt,
      sortOrder: item.sortOrder,
      filter: {
        id: item.filter.id,
        slug: item.filter.slug,
        label: item.filter.label,
      },
      group: { id: item.group.id, title: item.group.title },
      media: this.media.present(item.media),
    };
  }

  private async reorder(
    ids: string[],
    load: () => Promise<{ id: string }[]>,
    update: (id: string, sortOrder: number) => Prisma.PrismaPromise<unknown>,
  ) {
    const existing = await load();
    const existingIds = new Set(existing.map((row) => row.id));
    if (
      ids.length !== existing.length ||
      ids.some((id) => !existingIds.has(id))
    ) {
      throw new BadRequestException('Передайте все записи ровно один раз');
    }
    await this.prisma.$transaction(
      ids.map((id, sortOrder) => update(id, sortOrder)),
    );
  }

  private async ensureFilter(id: string) {
    const row = await this.prisma.menuFilter.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Фильтр не найден');
    }
  }

  private async ensureGroup(id: string) {
    const row = await this.prisma.menuGroup.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Классификация не найдена');
    }
  }

  private async ensureItem(id: string) {
    const row = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Позиция не найдена');
    }
  }

  private rethrowUnique(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }
    throw error;
  }
}
