import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSecurityModel } from '../../../generated/prisma/models';
export class UserSecurityResponseDto {
  @ApiProperty()
  isEmailVerified: boolean;

  @ApiPropertyOptional()
  emailVerifiedAt?: Date;

  @ApiPropertyOptional()
  assignedIp?: string;

  constructor(userSecurity: Partial<UserSecurityModel>) {
    this.isEmailVerified = userSecurity.isEmailVerified!;
    this.emailVerifiedAt = userSecurity.emailVerifiedAt
      ? new Date(userSecurity.emailVerifiedAt)
      : undefined;
    this.assignedIp = userSecurity.assignedIp ?? undefined;
  }
}
