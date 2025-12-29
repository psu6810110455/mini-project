import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Import Config
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { BookingsModule } from './bookings/bookings.module';
import { SportFieldsModule } from './sport-fields/sport-fields.module';

@Module({
  imports: [
    // 2. โหลด ConfigModule เพื่อให้อ่านไฟล์ .env ได้
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 3. ตั้งค่า Database แบบใช้ ConfigService (ตามโจทย์)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    BookingsModule,
    SportFieldsModule,
  ],
})
export class AppModule { }