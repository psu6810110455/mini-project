import { Module } from '@nestjs/common';
import { SportFieldsService } from './sport-fields.service';
import { SportFieldsController } from './sport-fields.controller';

@Module({
  controllers: [SportFieldsController],
  providers: [SportFieldsService],
})
export class SportFieldsModule {}
