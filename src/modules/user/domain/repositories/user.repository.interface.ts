import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  delete(id: number): Promise<{ message: string }>;
  findAll(): Promise<User[]>;
}
