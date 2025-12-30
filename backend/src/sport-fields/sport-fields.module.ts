import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ✅ ต้อง Import
import { SportFieldsService } from './sport-fields.service';
import { SportFieldsController } from './sport-fields.controller';
import { SportField } from './entities/sport-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SportField])], // ✅ ต้องเพิ่มบรรทัดนี้
  controllers: [SportFieldsController],
  providers: [SportFieldsService],
})
export class SportFieldsModule {}