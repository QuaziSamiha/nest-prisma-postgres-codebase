import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  ValidateNested,
  IsPhoneNumber,
  // Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto } from './create-profile.dto';
import { UserSecurityDto } from './user-security.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AuthProvider,
  UserRole,
  UserStatus,
} from '../../../generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Email must be at most 100 characters long' })
  email!: string;
  // @IsUnique(['User', 'email'])

  @ApiPropertyOptional({
    description: 'The password of the user',
    example: 'Password@123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password must be at most 255 characters long' })
  password?: string;
  // @IsOptional()
  // @IsString()
  // @MinLength(8, { message: 'Password must be at least 8 characters long' })
  // // Regex: At least one uppercase, one lowercase, one number, and one special character
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak',
  // })
  // password?: string;

  @ApiPropertyOptional({
    description: 'The phone or telephone number of the responsible person',
    example: '+8801750256844 or (+880) 2 223362613-4',
    minLength: 10,
    maxLength: 30,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;

  @ApiPropertyOptional({
    description: 'The status of the user account',
    enum: UserStatus,
    example: UserStatus.PENDING_VERIFICATION,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.PENDING_VERIFICATION;

  @ApiPropertyOptional({
    description: 'Authentication provider',
    enum: AuthProvider,
    example: AuthProvider.EMAIL,
  })
  @IsEnum(AuthProvider)
  @IsOptional()
  authProvider?: AuthProvider;

  @ApiPropertyOptional({ description: 'Provider ID for OAuth' })
  @IsString()
  @IsOptional()
  providerId?: string;

  @ApiProperty({ description: 'User profile information' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile!: CreateProfileDto;

  @ApiPropertyOptional({ description: 'User security information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSecurityDto)
  security?: UserSecurityDto;
}
