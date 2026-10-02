import { Controller, Get } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('site')
export class SiteController {
  constructor(private readonly site: SiteService) {}

  @Get()
  get() {
    return this.site.get();
  }
}
