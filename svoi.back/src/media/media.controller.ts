import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { AdminGuard } from '../auth/admin.guard';
import { MediaService } from './media.service';

type Uploaded = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

@Controller()
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get('admin/media')
  @UseGuards(AdminGuard)
  list() {
    return this.media.list();
  }

  @Post('admin/media')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFile() file?: Uploaded) {
    return this.media.upload(
      file
        ? {
            buffer: file.buffer,
            mimeType: file.mimetype,
            originalName: file.originalname,
          }
        : undefined,
    );
  }

  @Delete('admin/media/:id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.media.remove(id);
  }

  @Get('media/:id/file')
  async file(@Param('id') id: string, @Res() response: Response) {
    const opened = await this.media.open(id);
    response.setHeader('Content-Type', opened.mimeType);
    response.send(opened.buffer);
  }
}
