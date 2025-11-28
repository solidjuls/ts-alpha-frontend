import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure body parser to handle large payloads (for CSV uploads)
  // Increase limits to support large CSV files
  app.useBodyParser('json', {
    limit: '50mb',
    parameterLimit: 100000 // Increase parameter limit for large CSV data
  });
  app.useBodyParser('urlencoded', {
    limit: '50mb',
    extended: true,
    parameterLimit: 100000
  });

  // Enable cookie parser for JWT authentication
  app.use(cookieParser());

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4002;
  await app.listen(port);

  console.log(`🚀 NestJS Backend is running on: http://localhost:${port}/api`);
}

bootstrap();
