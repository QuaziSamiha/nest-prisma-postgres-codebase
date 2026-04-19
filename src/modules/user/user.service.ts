import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ProfileRepository } from './profile.repository';
import { UserSecurityRepository } from './user-security.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly securityRepo: UserSecurityRepository,
    private readonly configService: ConfigService, // 2. Inject ConfigService here
  ) {}

  async registerUser(dto: CreateUserDto): Promise<UserResponseDto> {
    // const { profile, ...userData } = dto;
    const { profile, security, ...userData } = dto;
    // 1. Check if user exists
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    // 2. Execute Transaction
    return await this.userRepo.withTransaction(async (tx) => {
      // Create User
      const user = await this.userRepo.create(
        {
          ...userData,
        },
        tx,
      );

      // Create Profile
      await this.profileRepo.create(
        {
          ...profile,
          userId: user.id,
          name:
            profile.name ||
            `${profile.firstName} ${profile.lastName || ''}`.trim(),
        },
        tx,
      );

      // Create Security record
      await this.securityRepo.create(
        {
          userId: user.id,
          isEmailVerified: security?.isEmailVerified || false,
        },
        tx,
      );

      const fullUser = await this.userRepo.findByEmail(user.email, tx);

      // 3. Handle the null possibility to satisfy TypeScript
      if (!fullUser) {
        throw new ConflictException(
          'Failed to retrieve user after registration',
        );
      }

      return new UserResponseDto(fullUser, this.configService);
    });
  }
}
