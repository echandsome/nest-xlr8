import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/database/schemas/user.schema';
import { CreateUserData, UpdateUserData } from '@/shared/interfaces';
import { ERROR_MESSAGES } from '@/shared/constants';
import { sanitizeData } from '@/shared/utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return {
      data: users.map(sanitizeData),
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

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return sanitizeData(user);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: CreateUserData) {
    try {
      const user = new this.userModel(data);
      const savedUser = await user.save();
      return sanitizeData(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateUserData) {
    const user = await this.findOne(id);
    
    // Check if email is being changed and if it already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return sanitizeData(updatedUser);
  }

  async remove(id: string) {
    await this.findOne(id); // This will throw if user doesn't exist
    await this.userModel.findByIdAndDelete(id).exec();
    return { message: 'User deleted successfully' };
  }
}
