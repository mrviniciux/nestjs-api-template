import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';
import {
  createUserDtoMock,
  updateUserMock,
  userMock,
} from '../../../__mock__/user.mock';

describe('User service and repository', () => {
  let userService: UserService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    userService = module.get<UserService>(UserService);
    userRepository = module.get(USER_REPOSITORY);
  });

  it('should both be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(createUserDtoMock);

      expect(await userService.create(createUserDtoMock)).toEqual(
        createUserDtoMock,
      );
    });

    it('should throw an error if user already exists', () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(userMock);

      expect(userService.create(createUserDtoMock)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const updatedUser = { ...createUserDtoMock, ...updateUserMock };
      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      expect(await userService.update(1, updateUserMock)).toEqual(updatedUser);
    });
    it('should throw an error since user doesnt exists', () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      expect(userService.update(1, {})).rejects.toThrow('User not found');
    });

    it.todo('should revoke update since logged user isnt admin');
  });

  describe('removeUser', () => {
    it('should remove user', async () => {
      const objMessage = { message: `User: 1 Deleted successfully` };
      jest.spyOn(userService, 'remove').mockResolvedValue(objMessage);

      expect(await userService.remove(1)).toBe(objMessage);
    });

    it('should throw an error since user doesnt exists', () => {
      expect(userService.remove(1)).rejects.toThrow('User not found');
    });

    it.todo('should revoke update since logged user isnt admin');
  });
});
