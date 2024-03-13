import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PORT } from './app.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fit Friends')
    .setDescription('Fit Friends API description')
    .setVersion('1.0')
    .addTag('trainings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    new Logger('Bootstrap').log(`🚀 Started on http://localhost:${PORT}/`);
  });
}
bootstrap();
