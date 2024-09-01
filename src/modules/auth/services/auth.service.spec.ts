import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../../modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../../../modules/user/enums/user.enum';
import { User } from '../../../modules/user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserCreds', () => {
    it('should return the user if credentials are valid', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
        role: UserRoles.MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUserCreds('test@example.com', 'password');
      expect(result).toBe(user);
      expect(userService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

      await expect(service.validateUserCreds('test@example.com', 'password')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
        role: UserRoles.MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUserCreds('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const user: User = {
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRoles.MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const token = 'jwtToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.generateToken(user);
      expect(result).toEqual({ access_token: token });
      expect(jwtService.sign).toHaveBeenCalledWith({
        name: user.name,
        sub: user.id,
        role: user.role,
      });
    });
  });
});
