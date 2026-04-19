import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../prisma/base.repository';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  private readonly PROFILE_SELECT = {
    firstName: true,
    lastName: true,
    name: true,
    avatarUrl: true,
    bio: true,
    dateOfBirth: true,
    gender: true,
    metadata: true,
  } as const;

  private readonly SECURITY_SELECT = {
    isEmailVerified: true,
    emailVerifiedAt: true,
    loginAttempts: true,
    lastLoginIp: true,
    assignedIp: true,
  } as const;

  private readonly FULL_USER_SELECT = {
    id: true,
    sid: true,
    email: true,
    role: true,
    status: true,
    authProvider: true,
    providerId: true,
    profile: { select: this.PROFILE_SELECT },
    security: { select: this.SECURITY_SELECT },
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
  } as const;

  private readonly USER_SELECT = {
    id: true,
    sid: true,
    email: true,
    role: true,
    status: true,
    authProvider: true,
    providerId: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
  } as const;

  async create(data: Prisma.UserCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.user.create({ data, select: this.FULL_USER_SELECT });
  }

  async findByEmail(email: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return client.user.findUnique({
      where: { email },
      select: this.FULL_USER_SELECT,
    });
  }
}
