import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateUserData, UpdateUserData } from '@/shared/interfaces';
import { ERROR_MESSAGES } from '@/shared/constants';
import { sanitizeUser } from '@/shared/utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map(sanitizeUser),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return sanitizeUser(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserData) {
    try {
      const user = await this.prisma.user.create({ data });
      return sanitizeUser(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async update(id: number, data: UpdateUserData) {
    const user = await this.findOne(id);
    
    // Check if email is being changed and if it already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return sanitizeUser(updatedUser);
  }

  async remove(id: number) {
    await this.findOne(id); // This will throw if user doesn't exist
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
