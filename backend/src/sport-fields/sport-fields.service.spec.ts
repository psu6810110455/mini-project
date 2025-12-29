import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldsService } from './sport-fields.service';

describe('SportFieldsService', () => {
  let service: SportFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportFieldsService],
    }).compile();

    service = module.get<SportFieldsService>(SportFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
