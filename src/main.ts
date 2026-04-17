import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// * The entry file of the application which uses the core function NestFactory to create a Nest application instance.
// * The main.ts includes an async function, which will bootstrap our application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
