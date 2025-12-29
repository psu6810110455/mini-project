import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { SportFieldsModule } from './sport-fields/sport-fields.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // 👈 บรรทัดนี้ห้ามหายครับ!
      database: 'database.sqlite', // 👈 ชื่อไฟล์ Database
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    SportFieldsModule,
    BookingsModule,
  ],
})
export class AppModule {}