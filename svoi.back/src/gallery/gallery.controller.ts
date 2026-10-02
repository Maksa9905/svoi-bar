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
import { GalleryService } from './gallery.service';

const side = z.enum(['left', 'right', 'top']);

const createSchema = z.object({
  mediaId: z.string().min(1),
  caption: z.string().min(1),
  alt: z.string(),
  height: z.number().int().positive(),
  showOnHome: z.boolean().optional(),
  mascotMediaId: z.string().min(1).nullable().optional(),
  mascotSide: side.nullable().optional(),
});

const updateSchema = createSchema.partial();
const orderSchema = z.object({ ids: z.array(z.string().min(1)).min(1) });

@Controller('admin/gallery')
@UseGuards(AdminGuard)
export class GalleryController {
  constructor(private readonly gallery: GalleryService) {}

  @Get()
  list() {
    return this.gallery.list();
  }

  @Post()
  create(@Body(new ZodPipe(createSchema)) body: z.infer<typeof createSchema>) {
    return this.gallery.create(body);
  }

  @Patch('order')
  reorder(@Body(new ZodPipe(orderSchema)) body: z.infer<typeof orderSchema>) {
    return this.gallery.reorder(body.ids);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(updateSchema)) body: z.infer<typeof updateSchema>,
  ) {
    return this.gallery.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gallery.remove(id);
  }
}
