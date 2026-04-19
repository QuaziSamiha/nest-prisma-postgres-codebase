import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../prisma/base.repository';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UserSecurityRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  private readonly USER_SECURITY_SELECT = {
    id: true,
    userId: true,
    isEmailVerified: true,
    emailVerifiedAt: true,
    loginAttempts: true,
    lastLoginIp: true,
    assignedIp: true,
  } as const;

  async create(
    data: Prisma.UserSecurityUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.userSecurity.create({
      data,
      select: this.USER_SECURITY_SELECT,
    });
  }
}
