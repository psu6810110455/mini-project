import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const admin = await usersService.findOneByUsername('admin');
    if (admin) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('mypassword', salt);
        await usersService.update(admin.id, { password: 'mypassword' } as any);
        console.log('Admin password reset successfully to: mypassword');
    } else {
        await usersService.create({
            username: 'admin',
            password: 'mypassword',
            role: 'admin' as any,
        });
        console.log('Admin user created successfully with password: mypassword');
    }

    await app.close();
}
bootstrap();
