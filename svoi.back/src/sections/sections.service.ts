import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { collectMediaIds } from '../common/media-ids';
import { jsonPayload } from '../common/json';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  parseSectionPayload,
  sectionRegistry,
  type SectionType,
} from './section.registry';

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  list() {
    return this.prisma.section.findMany({
      where: { page: 'home' },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(type: SectionType, payload: unknown, anchor: string | null) {
    const body = payload ?? sectionRegistry[type].defaultPayload;
    const parsed = this.parse(type, body);
    await this.media.assertExists([...collectMediaIds(parsed)]);
    const last = await this.prisma.section.findFirst({
      where: { page: 'home' },
      orderBy: { sortOrder: 'desc' },
    });

    try {
      return await this.prisma.section.create({
        data: {
          page: 'home',
          type,
          anchor,
          sortOrder: (last?.sortOrder ?? -1) + 1,
          payload: jsonPayload(parsed),
        },
      });
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(
    id: string,
    input: { payload?: unknown; anchor?: string | null },
  ) {
    const current = await this.find(id);
    const nextPayload =
      input.payload === undefined
        ? current.payload
        : this.parse(current.type, input.payload);
    if (input.payload !== undefined) {
      await this.media.assertExists([...collectMediaIds(nextPayload)]);
    }

    try {
      return await this.prisma.section.update({
        where: { id },
        data: {
          payload: jsonPayload(nextPayload),
          anchor: input.anchor === undefined ? current.anchor : input.anchor,
        },
      });
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async remove(id: string) {
    await this.find(id);
    await this.prisma.section.delete({ where: { id } });
  }

  async reorder(ids: string[]) {
    const existing = await this.list();
    const existingIds = new Set(existing.map((section) => section.id));
    if (
      ids.length !== existing.length ||
      ids.some((id) => !existingIds.has(id))
    ) {
      throw new BadRequestException(
        'Передайте все секции главной ровно один раз',
      );
    }

    await this.prisma.$transaction(
      ids.map((id, sortOrder) =>
        this.prisma.section.update({ where: { id }, data: { sortOrder } }),
      ),
    );

    return this.list();
  }

  private async find(id: string) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section || section.page !== 'home') {
      throw new NotFoundException('Секция не найдена');
    }
    return section;
  }

  private parse(type: string, payload: unknown) {
    const parsed = parseSectionPayload(type, payload);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error);
    }
    return parsed.data;
  }

  private rethrowUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Такой якорь уже занят');
    }
    throw error;
  }
}
