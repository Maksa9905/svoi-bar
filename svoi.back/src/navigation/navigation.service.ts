import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { presentNavLink } from './present-nav';

export type NavInput = {
  placement: 'header' | 'footer';
  label: string;
  targetType: 'section' | 'page' | 'action';
  sectionId?: string | null;
  pagePath?: string | null;
  action?: string | null;
};

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  async list(placement?: 'header' | 'footer') {
    const links = await this.prisma.navLink.findMany({
      where: placement ? { placement } : undefined,
      orderBy: [{ placement: 'asc' }, { sortOrder: 'asc' }],
    });
    const sections = await this.sectionMap();
    return links.map((link) => presentNavLink(link, sections));
  }

  async create(input: NavInput) {
    await this.assertTarget(input);
    const last = await this.prisma.navLink.findFirst({
      where: { placement: input.placement },
      orderBy: { sortOrder: 'desc' },
    });

    const created = await this.prisma.navLink.create({
      data: {
        placement: input.placement,
        label: input.label,
        sortOrder: (last?.sortOrder ?? -1) + 1,
        targetType: input.targetType,
        sectionId: input.targetType === 'section' ? input.sectionId : null,
        pagePath: input.targetType === 'page' ? input.pagePath : null,
        action: input.targetType === 'action' ? input.action : null,
      },
    });

    return presentNavLink(created, await this.sectionMap());
  }

  async update(id: string, input: Partial<NavInput> & { label?: string }) {
    const current = await this.prisma.navLink.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException('Пункт меню не найден');
    }

    const next: NavInput = {
      placement: (input.placement ??
        current.placement) as NavInput['placement'],
      label: input.label ?? current.label,
      targetType: (input.targetType ??
        current.targetType) as NavInput['targetType'],
      sectionId:
        input.sectionId === undefined ? current.sectionId : input.sectionId,
      pagePath:
        input.pagePath === undefined ? current.pagePath : input.pagePath,
      action: input.action === undefined ? current.action : input.action,
    };
    await this.assertTarget(next);

    const updated = await this.prisma.navLink.update({
      where: { id },
      data: {
        placement: next.placement,
        label: next.label,
        targetType: next.targetType,
        sectionId: next.targetType === 'section' ? next.sectionId : null,
        pagePath: next.targetType === 'page' ? next.pagePath : null,
        action: next.targetType === 'action' ? next.action : null,
      },
    });

    return presentNavLink(updated, await this.sectionMap());
  }

  async remove(id: string) {
    const current = await this.prisma.navLink.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException('Пункт меню не найден');
    }
    await this.prisma.navLink.delete({ where: { id } });
  }

  async reorder(placement: 'header' | 'footer', ids: string[]) {
    const existing = await this.prisma.navLink.findMany({
      where: { placement },
    });
    const existingIds = new Set(existing.map((link) => link.id));
    if (
      ids.length !== existing.length ||
      ids.some((id) => !existingIds.has(id))
    ) {
      throw new BadRequestException(
        'Передайте все пункты этого меню ровно один раз',
      );
    }

    await this.prisma.$transaction(
      ids.map((id, sortOrder) =>
        this.prisma.navLink.update({ where: { id }, data: { sortOrder } }),
      ),
    );

    return this.list(placement);
  }

  private async assertTarget(input: NavInput) {
    if (input.targetType === 'section') {
      if (!input.sectionId) {
        throw new BadRequestException('Для якоря нужна секция');
      }
      const section = await this.prisma.section.findUnique({
        where: { id: input.sectionId },
      });
      if (!section?.anchor) {
        throw new BadRequestException('У секции нет якоря');
      }
    }

    if (
      input.targetType === 'page' &&
      input.pagePath !== '/menu' &&
      input.pagePath !== '/gallery'
    ) {
      throw new BadRequestException('Страница может быть /menu или /gallery');
    }

    if (input.targetType === 'action' && input.action !== 'booking') {
      throw new BadRequestException('Действие может быть только booking');
    }
  }

  private async sectionMap() {
    const sections = await this.prisma.section.findMany({
      select: { id: true, anchor: true },
    });
    return new Map(sections.map((section) => [section.id, section]));
  }
}
