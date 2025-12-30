import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 👇 เพิ่มบรรทัดนี้ครับ เพื่ออนุญาตให้หน้าเว็บ (Frontend) ยิง API เข้ามาได้
  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();