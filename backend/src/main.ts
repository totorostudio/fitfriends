import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fit Friends')
    .setDescription('Fit Friends API description')
    .setVersion('1.0')
    .build();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port, () => {
    new Logger('Bootstrap').log(`🚀 Started on http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
