import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserSecurityRepository } from './user-security.repository';
import { ProfileRepository } from './profile.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    ProfileRepository,
    UserSecurityRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
