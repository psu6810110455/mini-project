import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldsController } from './sport-fields.controller';
import { SportFieldsService } from './sport-fields.service';

describe('SportFieldsController', () => {
  let controller: SportFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportFieldsController],
      providers: [SportFieldsService],
    }).compile();

    controller = module.get<SportFieldsController>(SportFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
