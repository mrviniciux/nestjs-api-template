import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../../services/user.service';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';
import { createUserDtoMock } from '../../../__mock__/user.mock';

describe('UsersController', () => {
  let controller: UserController;
  let repository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get(UserController);
    repository = module.get(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST should create a new user', async () => {
    jest.spyOn(repository, 'create').mockResolvedValue(createUserDtoMock);
    const resp = await controller.create(createUserDtoMock);

    expect(resp).toBe(createUserDtoMock);
    expect(repository.create).toHaveBeenCalled();
  });

  it('GET find all', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([createUserDtoMock]);

    const resp = await controller.findAll();

    expect(resp).toHaveLength(1);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('GET find by id', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(createUserDtoMock);

    const resp = await controller.findById(1);

    expect(resp).toBe(createUserDtoMock);
    expect(repository.findById).toHaveBeenCalled();
  });

  it('PATCH id should update an item', async () => {
    const updatedValue = { ...createUserDtoMock, firstName: 'pelé' };
    jest.spyOn(repository, 'findById').mockResolvedValue(createUserDtoMock);
    jest.spyOn(repository, 'update').mockResolvedValue(updatedValue);

    const resp = await controller.update(1, { firstName: 'pelé' });

    expect(resp).toBe(updatedValue);
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });

  it('DELETE user', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(createUserDtoMock);
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ message: 'user removed successfully' });

    const resp = await controller.remove(1);

    expect(resp.message).toBe('user removed successfully');
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.delete).toHaveBeenCalled();
  });
});
