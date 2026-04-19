import { ConfigService } from '@nestjs/config';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AuthProvider,
  UserRole,
  UserStatus,
} from '../../../generated/prisma/client';
import { ProfileResponseDto } from './profile-response.dto';
import { UserSecurityResponseDto } from './user-security-response.dto';
import {
  ProfileModel,
  UserModel,
  UserSecurityModel,
} from '../../../generated/prisma/models';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id!: number;

  @ApiProperty({
    description: 'User SID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  sid!: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email!: string;

  @ApiPropertyOptional({ description: 'User phone', example: '+8801750256844' })
  phone?: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @ApiProperty({
    enum: UserStatus,
    description: 'User status',
    example: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @ApiProperty({
    enum: AuthProvider,
    description: 'Authentication provider',
    example: AuthProvider.EMAIL,
  })
  authProvider!: AuthProvider;

  @ApiPropertyOptional({ description: 'Provider ID for OAuth' })
  providerId?: string;

  @ApiProperty({ type: ProfileResponseDto })
  profile!: ProfileResponseDto;

  @ApiProperty({ type: UserSecurityResponseDto })
  security!: UserSecurityResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @ApiPropertyOptional({ description: 'Last login timestamp' })
  lastLoginAt?: Date;

  constructor(
    user: Partial<UserModel> & {
      profile?: Partial<ProfileModel> | null;
      security?: Partial<UserSecurityModel> | null;
      lastLoginAt?: Date | string | null;
    },
    configService: ConfigService,
  ) {
    this.id = user.id!;
    this.sid = user.sid!;
    this.email = user.email!;
    this.phone = user.phone ?? undefined;
    this.role = user.role!;
    this.status = user.status!;
    this.authProvider = user.authProvider!;
    this.providerId = user.providerId ?? undefined;
    this.createdAt = user.createdAt!;
    this.updatedAt = user.updatedAt!;
    const lastLoginAtRaw = user.lastLoginAt;
    if (lastLoginAtRaw === undefined || lastLoginAtRaw === null) {
      this.lastLoginAt = undefined;
    } else if (lastLoginAtRaw instanceof Date) {
      this.lastLoginAt = lastLoginAtRaw;
    } else {
      // Prisma/DTO typing can be `string | Date`; normalize to `Date`.
      this.lastLoginAt = new Date(lastLoginAtRaw);
    }

    // 3. Safety Check: Only initialize if the relation was loaded by the Repository
    // This solves the "Type 'undefined' is not assignable" error
    if (user.profile) {
      this.profile = new ProfileResponseDto(user.profile, configService);
    }

    if (user.security) {
      this.security = new UserSecurityResponseDto(user.security);
    }
  }
}
