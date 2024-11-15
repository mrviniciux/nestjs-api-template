import { User } from '../domain/entities/user.entity';
import { UserType } from '../infraestructure/database/models/user.model';

export const createUserDtoMock: User = {
  email: 'nether@minecraft.com',
  firstName: 'Nether',
  lastName: 'Silva',
  password: '123',
  type: 'ADMIN' as UserType,
};

export const userMock = {
  id: 1,
  email: 'nether@minecraft.com',
  firstName: 'Nether',
  lastName: 'Silva',
  password: '123',
  type: 'ADMIN' as UserType,
};

export const updateUserMock = {
  firstName: 'Neether',
};
