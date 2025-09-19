import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/core/database/schemas/user.schema';
import { ICreateUserData, IUpdateUserData } from '@/shared/interfaces';
import { sanitizeData } from '@/shared/utils/helper';
import { CustomLoggerService } from '@/core/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: CustomLoggerService,
  ) {}

  async findAll(page = 1, limit = 10) {
    this.logger.debug(`Querying users from database - Page: ${page}, Limit: ${limit}`, 'UsersService');
    
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

    this.logger.debug(`Database query completed - Found ${users.length} users out of ${total} total`, 'UsersService');

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
      throw new NotFoundException('User not found');
    }
    return sanitizeData(user);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: ICreateUserData) {
    try {
      const user = new this.userModel(data);
      const savedUser = await user.save();
      return sanitizeData(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async update(id: string, data: IUpdateUserData) {
    const user = await this.findOne(id);
    
    // Check if email is being changed and if it already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
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
