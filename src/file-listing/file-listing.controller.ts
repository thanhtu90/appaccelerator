import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import {
  FileListingResponse,
  FileListingService,
  GetFileListingQueryParams,
} from './file-listing.service';

@Controller('file-listing')
export class FileListingController {
  constructor(private readonly service: FileListingService) {}

  @ApiQuery({ name: 'directory', type: 'string' })
  @Get()
  listing(
    @Query() query: GetFileListingQueryParams,
  ): Promise<FileListingResponse> {
    const { directory, page } = query;

    if (!!directory === false) {
      throw new HttpException('directory is required', HttpStatus.BAD_REQUEST);
    }
    return this.service.retrieveListing(directory, page ?? 1);
  }
}
