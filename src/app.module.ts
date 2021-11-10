import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileListingModule } from './file-listing/file-listing.module';

@Module({
  imports: [FileListingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
