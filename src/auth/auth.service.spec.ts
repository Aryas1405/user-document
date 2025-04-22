import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/utills/contant';

jest.mock('bcrypt');

const mockUserService = {
  getByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService - Simple', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      mockJwtService as unknown as JwtService,
      mockUserService as unknown as UserService
    );
    jest.clearAllMocks();
  });

  it('should register new user', async () => {
    mockUserService.getByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPwd');
    mockUserService.createUser.mockResolvedValue({ id: 1 });

    const res = await authService.register('test', 'test@example.com', 'pass');
    expect(res).toEqual({ message: 'User registered successfully', userId: 1 });
  });

  it('should throw if user already exists on register', async () => {
    mockUserService.getByEmail.mockResolvedValue({ id: 1 });
    await expect(
      authService.register('test', 'test@example.com', 'pass')
    ).rejects.toThrow('User already exists');
  });

  it('should login user and return token', async () => {
    mockUserService.getByEmail.mockResolvedValue({
      id: 1,
      password: 'hashedPwd',
      role: UserRole.ADMIN,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('test_token');

    const res = await authService.login('test@example.com', 'pass');
    expect(res.access_token).toBe('test_token');
  });

  it('should throw if user does not exist on login', async () => {
    mockUserService.getByEmail.mockResolvedValue(null);
    await expect(authService.login('nope@example.com', 'pass')).rejects.toThrow('User does not exists');
  });

  it('should throw if password is invalid on login', async () => {
    mockUserService.getByEmail.mockResolvedValue({ id: 1, password: 'hashedPwd' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });
});
