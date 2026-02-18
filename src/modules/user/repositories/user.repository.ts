import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id, isActive: true },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email, isActive: true },
    });
  }

  create(
    data: Pick<User, 'name' | 'password' | 'email' | 'picture'>,
  ): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }
}
