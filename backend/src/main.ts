import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Diary API')
    .setDescription('The diary API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
