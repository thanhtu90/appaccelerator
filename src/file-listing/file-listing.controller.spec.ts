import { Test, TestingModule } from '@nestjs/testing';
import { FileListingController } from './file-listing.controller';

describe('FileListingController', () => {
  let controller: FileListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileListingController],
    }).compile();

    controller = module.get<FileListingController>(FileListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
