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
import { anchorSchema, sectionTypes } from './section.registry';
import { SectionsService } from './sections.service';

const createSchema = z.object({
  type: z.enum(sectionTypes),
  anchor: anchorSchema.optional(),
  payload: z.unknown().optional(),
});

const updateSchema = z
  .object({
    anchor: anchorSchema.optional(),
    payload: z.unknown().optional(),
  })
  .refine(
    (value) => value.anchor !== undefined || value.payload !== undefined,
    {
      message: 'Нужно передать якорь или содержимое',
    },
  );

const orderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

@Controller('admin/sections')
@UseGuards(AdminGuard)
export class SectionsController {
  constructor(private readonly sections: SectionsService) {}

  @Get('types')
  types() {
    return sectionTypes;
  }

  @Get()
  list() {
    return this.sections.list();
  }

  @Post()
  create(@Body(new ZodPipe(createSchema)) body: z.infer<typeof createSchema>) {
    return this.sections.create(body.type, body.payload, body.anchor ?? null);
  }

  @Patch('order')
  reorder(@Body(new ZodPipe(orderSchema)) body: z.infer<typeof orderSchema>) {
    return this.sections.reorder(body.ids);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(updateSchema)) body: z.infer<typeof updateSchema>,
  ) {
    return this.sections.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sections.remove(id);
  }
}
