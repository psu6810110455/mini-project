import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // ✅ เปิดให้เข้าถึงรูปภาพผ่าน URL เช่น http://localhost:3000/uploads/badminton.jpg
  app.useStaticAssets(join(process.cwd(), 'public', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors(); 
  await app.listen(3000);
}
bootstrap();