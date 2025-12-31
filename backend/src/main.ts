import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      // 'http://localhost:5173',
      // 'http://localhost:3000',
      'http://3.76.203.231:3001',
    ], // React app domenini yozing
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const environment = configService.get('environment');
  await app.listen(port, () => {
    console.log(`Server host: http://localhost:${port}`);
    console.log(`Environment: ${environment}`);
  });
}
bootstrap();
