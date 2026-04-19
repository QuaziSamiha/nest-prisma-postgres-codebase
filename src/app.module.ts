import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OtpModule } from './modules/otp/otp.module';
import { SessionModule } from './modules/session/session.module';
import databaseConfig from './config/database.config';
// import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true, // * Enable variable expansion (e.g., ${VAR_NAME})
      // envFilePath: ['.env.development', '.env'], // * Fallback logic
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'], // * Fallback logic
      load: [databaseConfig],
      cache: true, //! Best practice: performance boost for process.env
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60, // * Reset counter after 60 seconds
        limit: 100, // * Allow 100 requests per IP in 60s
      },
    ]),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    PrismaModule,
    UserModule,
    AuthModule,
    OtpModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
