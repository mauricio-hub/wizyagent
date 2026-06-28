import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config({ override: true });

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Wizybot API')
    .setDescription('AI chatbot with product search and currency conversion')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);  

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  console.log(`Server running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
