import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AdminGuard } from '../auth/admin.guard';
import { ZodPipe } from '../common/zod.pipe';
import { NavigationService } from './navigation.service';

const placement = z.enum(['header', 'footer']);
const targetType = z.enum(['section', 'page', 'action']);

const writeSchema = z.object({
  placement,
  label: z.string().min(1),
  targetType,
  sectionId: z.string().min(1).nullable().optional(),
  pagePath: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
});

const updateSchema = writeSchema.partial();

const orderSchema = z.object({
  placement,
  ids: z.array(z.string().min(1)).min(1),
});

@Controller('admin/navigation')
@UseGuards(AdminGuard)
export class NavigationController {
  constructor(private readonly navigation: NavigationService) {}

  @Get()
  list(@Query('placement') place?: string) {
    if (!place) {
      return this.navigation.list();
    }
    const parsed = placement.safeParse(place);
    if (!parsed.success) {
      throw new BadRequestException('placement: header или footer');
    }
    return this.navigation.list(parsed.data);
  }

  @Post()
  create(@Body(new ZodPipe(writeSchema)) body: z.infer<typeof writeSchema>) {
    return this.navigation.create(body);
  }

  @Patch('order')
  reorder(@Body(new ZodPipe(orderSchema)) body: z.infer<typeof orderSchema>) {
    return this.navigation.reorder(body.placement, body.ids);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(updateSchema)) body: z.infer<typeof updateSchema>,
  ) {
    return this.navigation.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navigation.remove(id);
  }
}
