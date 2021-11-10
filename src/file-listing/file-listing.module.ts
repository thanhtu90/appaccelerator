import { Module } from '@nestjs/common';
import { FileListingController } from './file-listing.controller';
import { FileListingService } from './file-listing.service';

@Module({
  controllers: [FileListingController],
  providers: [FileListingService]
})
export class FileListingModule {}
