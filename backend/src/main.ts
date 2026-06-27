import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config({ override: true });

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();
