import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UserSecurityDto {
  @ApiPropertyOptional({
    description: 'Indicates whether the user has verified their email address',
    example: true,
  })
  @IsBoolean()
  isEmailVerified!: boolean;

  @ApiPropertyOptional({
    description: 'Assigned IP address',
    example: '192.168.1.100',
  })
  @IsString()
  @IsOptional()
  @MaxLength(15, { message: 'Assigned IP must be at most 15 characters long' })
  assignedIp?: string;
}
