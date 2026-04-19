import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { Request, Response } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerMultipartLogoRequestInterceptor } from './utils/swagger-multipart-formdata.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5001;
  const prefix = configService.get<string>('API_PREFIX') || 'api/v1';

  // * Enable global validation
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away fields that aren't in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown fields are sent
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Thai Health Product API')
    .setDescription(
      `API documentation for Thai Health Product Backend. This documentation provides detailed information about all available endpoints, authentication methods, and data models used in the Thai Health Product system.`,
    )
    .setVersion('1.0.0')

    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Enhanced Swagger UI configuration
  SwaggerModule.setup('api-doc', app, document, {
    explorer: true,
    swaggerOptions: {
      showRequestDuration: true,
      persistAuthorization: true,
      defaultModelRendering: 'example',
      // ADD THIS to ensure your nested objects are expanded by default:
      defaultModelExpandDepth: 5,
      defaultModelsExpandDepth: 3,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      // * Add multipart form-data support
      requestInterceptor: swaggerMultipartLogoRequestInterceptor,
    },
  });

  // * ======= ROOT ENDPOINT =======
  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.send('Thai Health Product Server');
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  console.log(`Application is running on: http://localhost:${port}/${prefix}`);
  console.log(`Swagger UI is running on: http://localhost:${port}/api-doc`);
  await app.listen(port);
}
// bootstrap();
bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import { ValidationPipe } from '@nestjs/common';
// import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { Request, Response } from 'express';
// import { DocumentBuilder } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // * Enable global validation
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // Strips away fields that aren't in the DTO
//       forbidNonWhitelisted: true, // Throws an error if unknown fields are sent
//       transform: true, // Automatically transforms payloads to DTO instances
//     }),
//   );
//   app.useGlobalFilters(new GlobalExceptionFilter());
//   app.useGlobalInterceptors(new ResponseInterceptor());

//   const configService = app.get(ConfigService);
//   const port = configService.get<number>('PORT') || 5001;
//   const prefix = configService.get<string>('API_PREFIX') || 'api/v1';

//   app.setGlobalPrefix(prefix);

//   // Swagger configuration
//   const config = new DocumentBuilder()
//     .setTitle('Thai Health Product API')
//     .setDescription(
//       `API documentation for Thai Health Product Backend. This documentation provides detailed information about all available endpoints, authentication methods, and data models used in the Thai Health Product system.`,
//     )
//     .setVersion('1.0.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//       },
//       'JWT-auth',
//     )
//     .addCookieAuth('refreshToken')
//     .addTag('Authentication', 'Endpoints for authentication and authorization.')
//     .addTag('System', 'Endpoints for health checks and system status')
//     .addTag('App', 'Endpoints for managing the application')
//     .addTag(
//       'Users',
//       'Endpoints for user management including creation, updating, and user details.',
//     )

//     .build();

//   app.getHttpAdapter().get('/', (req: Request, res: Response) => {
//     res.send('Thai Health Product Server');
//   });

//   console.log(`Application is running on: http://localhost:${port}`);
//   await app.listen(port);
// }
// // bootstrap();
// bootstrap().catch((err) => {
//   console.error('Error starting server:', err);
//   process.exit(1);
// });
