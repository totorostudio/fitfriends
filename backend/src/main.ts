import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './app.const';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    new Logger('Bootstrap').log(`🚀 Started on http://localhost:${PORT}/`);
  });
}
bootstrap();
