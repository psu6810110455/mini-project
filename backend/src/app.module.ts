import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Import Config
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

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
        entities: [User], // ใส่ Entity ทั้งหมดที่นี่ (หรือใช้ autoLoadEntities: true)
        synchronize: true, // true แค่ตอน Dev (มันจะแก้ Table ให้เอง)
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}