import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS para permitir peticiones desde el frontend
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'], // Permitir múltiples orígenes
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  }));

  await app.listen(4000);
  console.log('Servidor corriendo en http://localhost:4000');
}
bootstrap(); 