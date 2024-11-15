import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { UserModel } from '../database/models/user.model';
import { User } from '../../domain/entities/user.entity';
import { CartItemModel } from '../../../cart/infraestructure/database/models/cart-item.model';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(createUserDto);
    return user.toJSON() as User;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { id },
      include: [{ model: CartItemModel }],
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as User) : null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await user.update(updateUserDto);
    return user.toJSON() as User;
  }

  async delete(id: number): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      where: { id },
    });

    await user.destroy();
    return { message: `User: ${id} Deleted successfully` };
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll();
    return users.map((user) => user.toJSON() as User);
  }
}
