import { Test, TestingModule } from '@nestjs/testing';
import { FileListingService } from './file-listing.service';

describe('FileListingService', () => {
  let service: FileListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileListingService],
    }).compile();

    service = module.get<FileListingService>(FileListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
