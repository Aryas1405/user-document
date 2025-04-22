import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  // Test for createUser method
  it('should create a user', async () => {
    const userDto = { name: 'Jane Doe', email: 'jane@example.com', password: 'password123', role: UserRole.ADMIN };
    const savedUser = { ...userDto, id: 1 };

    jest.spyOn(userRepository, 'create').mockReturnValue(savedUser as User);
    jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser as User);

    const result = await userService.createUser(userDto);
    expect(result).toEqual(savedUser);
    expect(userRepository.create).toHaveBeenCalledWith(userDto);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
  });

  // Test for getByEmail method
  it('should return a user by email', async () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: UserRole.ADMIN };
    
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

    const result = await userService.getByEmail('john@example.com');
    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
  });

  // Test for updateUser method
  it('should update user details', async () => {
    const existingUser = { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: UserRole.ADMIN };
    const updatedData = { name: 'Johnathan Doe' };
    const updatedUser = { ...existingUser, ...updatedData };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser as User);
    jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as User);

    const result = await userService.updateUser(1, updatedData);
    expect(result).toEqual(updatedUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
  });

  // Test for listUser method
  it('should return a list of users', async () => {
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: UserRole.ADMIN },
    ];
    const count = 1;
    const filter = { limit: 10, offset: 0, search: '', role: UserRole.ADMIN };

    jest.spyOn(userRepository, 'findAndCount').mockResolvedValue([users, count]);

    const result = await userService.listUser(filter);
    expect(result).toEqual({ users, count });
    expect(userRepository.findAndCount).toHaveBeenCalledWith({
      where: expect.anything(),
      skip: filter.offset,
      take: filter.limit,
    });
  });

  // Test for user not found in updateUser method
  it('should throw an error if user does not exist in updateUser', async () => {
    const updatedData = { name: 'Johnathan Doe' };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    try {
      await userService.updateUser(1, updatedData);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('User not exist !!');
    }
  });

  // Test for email update error in updateUser method
  it('should throw an error if email is being updated', async () => {
    const existingUser = { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: UserRole.ADMIN };
    const updatedData = { email: 'newemail@example.com' };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser as User);

    try {
      await userService.updateUser(1, updatedData);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Email can not be updated');
    }
  });
});
