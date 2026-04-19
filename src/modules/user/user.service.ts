import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ProfileRepository } from './profile.repository';
import { UserSecurityRepository } from './user-security.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { HashUtil } from '../../common/utils/auth/hash.util';
@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;
  constructor(
    private readonly userRepo: UserRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly securityRepo: UserSecurityRepository,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const { profile, security, ...userData } = dto;

    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    // * HASH THE PASSWORD
    // const hashedPassword: string | undefined = userData.password
    //   ? await bcrypt.hash(userData.password, this.SALT_ROUNDS)
    //   : undefined;
    const hashedPassword = userData.password
      ? await HashUtil.hash(userData.password)
      : undefined;

    console.log(hashedPassword);

    return await this.userRepo.withTransaction(async (tx) => {
      // * Create User
      const user = await this.userRepo.create(
        {
          ...userData,
          password: hashedPassword,
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

      if (!fullUser) {
        throw new ConflictException(
          'Failed to retrieve user after registration',
        );
      }

      return new UserResponseDto(fullUser, this.configService);
    });
  }
}
