import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportFieldsService } from './sport-fields.service';
import { SportFieldsController } from './sport-fields.controller';
import { SportField } from './entities/sport-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SportField])],
  controllers: [SportFieldsController],
  providers: [SportFieldsService],
  exports: [SportFieldsService],
})
export class SportFieldsModule { }
