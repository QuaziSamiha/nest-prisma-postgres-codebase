import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../prisma/base.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProfileRepository extends BaseRepository {
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

  async create(
    data: Prisma.ProfileUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return client.profile.create({ data, select: this.PROFILE_SELECT });
  }
}
