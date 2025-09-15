import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from '../../core/database/schemas/user.schema';
import { CreateUserData, UpdateUserData } from '../../shared/interfaces';
import { CustomLoggerService } from '../../core/logger/logger.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let loggerService: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    bio: 'Test bio',
    createdAt: '2025-09-15T15:43:01.864Z',
    updatedAt: '2025-09-15T15:43:01.864Z',
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockSanitizedUser = {
    id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Test bio',
    createdAt: '2025-09-15T15:43:01.864Z',
    updatedAt: '2025-09-15T15:43:01.864Z',
  };

  // Mock constructor for new this.userModel(data)
  const MockUser: any = jest.fn().mockImplementation((data) => {
    const user = { ...mockUser, ...data };
    user.save = jest.fn().mockResolvedValue(user);
    return user;
  });

  // Add static methods to the constructor
  MockUser.find = jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockUser]),
  });
  MockUser.findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  MockUser.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  MockUser.findByIdAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  MockUser.findByIdAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  MockUser.countDocuments = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(1),
  });

  const mockLoggerService = {
    debug: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUser,
        },
        {
          provide: CustomLoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
    loggerService = module.get<CustomLoggerService>(CustomLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const result = await service.findAll(1, 10);

      expect(MockUser.find).toHaveBeenCalled();
      expect(MockUser.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockSanitizedUser],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(MockUser.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockSanitizedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      MockUser.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const result = await service.findByEmail('john@example.com');

      expect(MockUser.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    const createData: CreateUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      bio: 'Test bio',
    };

    it('should create user successfully', async () => {
      const result = await service.create(createData);

      expect(MockUser).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockSanitizedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const error: any = new Error('E11000 duplicate key error');
      error.code = 11000;
      MockUser.mockImplementationOnce(() => {
        throw error;
      });

      await expect(service.create(createData)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateData: UpdateUserData = {
      name: 'Jane Doe',
      bio: 'Updated bio',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockSanitizedUser, ...updateData };
      MockUser.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update('507f1f77bcf86cd799439011', updateData);

      expect(MockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateDataWithEmail: UpdateUserData = {
        email: 'jane@example.com',
      };
      const existingUser = { ...mockUser, email: 'jane@example.com' };
      
      MockUser.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(existingUser),
      });

      await expect(service.update('507f1f77bcf86cd799439011', updateDataWithEmail)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(MockUser.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException if user not found', async () => {
      MockUser.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});