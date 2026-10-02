import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LocalMediaStorage } from './local-media.storage';
import { MEDIA_STORAGE } from './media-storage';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { S3MediaStorage } from './s3-media.storage';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: MEDIA_STORAGE,
      useFactory: () =>
        process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID
          ? new S3MediaStorage()
          : new LocalMediaStorage(),
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
