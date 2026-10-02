import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LocalMediaStorage } from './local-media.storage';
import { MEDIA_STORAGE } from './media-storage';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    { provide: MEDIA_STORAGE, useClass: LocalMediaStorage },
  ],
  exports: [MediaService],
})
export class MediaModule {}
