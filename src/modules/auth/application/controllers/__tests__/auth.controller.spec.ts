import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../../user/application/services/user.service';
import { USER_REPOSITORY } from '../../../../user/domain/repositories/user.repository.interface';
import {
  createUserDtoMock,
  userMock,
} from '../../../../user/__mock__/user.mock';
import { UserType } from 'src/modules/user/infraestructure/database/models/user.model';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe.skip('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password' };

    it('should return an access token when credentials are valid', async () => {
      const token = {
        id: createUserDtoMock.id,
        firstName: createUserDtoMock.firstName,
        type: 'ADMIN' as UserType,
        email: createUserDtoMock.email,
        token: 'vdfmvlksdfmklgmklq4m', //bearer token
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(userMock);
      jest.spyOn(authService, 'login').mockResolvedValue(token);

      const result = await authController.login(loginDto);
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );

      expect(result).toEqual(token);
    });
  });
});
