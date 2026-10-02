import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AdminGuard } from '../auth/admin.guard';
import { ZodPipe } from '../common/zod.pipe';
import { MenuService } from './menu.service';

const filterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(1),
});

const groupSchema = z.object({ title: z.string().min(1) });
const orderSchema = z.object({ ids: z.array(z.string().min(1)).min(1) });
const itemOrderSchema = orderSchema.extend({ groupId: z.string().min(1) });

const itemSchema = z.object({
  filterId: z.string().min(1),
  groupId: z.string().min(1),
  mediaId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  accent: z.string().min(1),
  alt: z.string(),
});

@Controller('admin/menu')
@UseGuards(AdminGuard)
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  @Get()
  catalog() {
    return this.menu.catalog();
  }

  @Post('filters')
  createFilter(
    @Body(new ZodPipe(filterSchema)) body: z.infer<typeof filterSchema>,
  ) {
    return this.menu.createFilter(body);
  }

  @Patch('filters/order')
  reorderFilters(
    @Body(new ZodPipe(orderSchema)) body: z.infer<typeof orderSchema>,
  ) {
    return this.menu.reorderFilters(body.ids);
  }

  @Patch('filters/:id')
  updateFilter(
    @Param('id') id: string,
    @Body(new ZodPipe(filterSchema.partial()))
    body: z.infer<ReturnType<typeof filterSchema.partial>>,
  ) {
    return this.menu.updateFilter(id, body);
  }

  @Delete('filters/:id')
  removeFilter(@Param('id') id: string) {
    return this.menu.removeFilter(id);
  }

  @Post('groups')
  createGroup(
    @Body(new ZodPipe(groupSchema)) body: z.infer<typeof groupSchema>,
  ) {
    return this.menu.createGroup(body);
  }

  @Patch('groups/order')
  reorderGroups(
    @Body(new ZodPipe(orderSchema)) body: z.infer<typeof orderSchema>,
  ) {
    return this.menu.reorderGroups(body.ids);
  }

  @Patch('groups/:id')
  updateGroup(
    @Param('id') id: string,
    @Body(new ZodPipe(groupSchema)) body: z.infer<typeof groupSchema>,
  ) {
    return this.menu.updateGroup(id, body);
  }

  @Delete('groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.menu.removeGroup(id);
  }

  @Post('items')
  createItem(@Body(new ZodPipe(itemSchema)) body: z.infer<typeof itemSchema>) {
    return this.menu.createItem(body);
  }

  @Patch('items/order')
  reorderItems(
    @Body(new ZodPipe(itemOrderSchema)) body: z.infer<typeof itemOrderSchema>,
  ) {
    return this.menu.reorderItems(body.groupId, body.ids);
  }

  @Patch('items/:id')
  updateItem(
    @Param('id') id: string,
    @Body(new ZodPipe(itemSchema.partial()))
    body: z.infer<ReturnType<typeof itemSchema.partial>>,
  ) {
    return this.menu.updateItem(id, body);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.menu.removeItem(id);
  }
}
