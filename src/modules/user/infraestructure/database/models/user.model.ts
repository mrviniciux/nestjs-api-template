import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { CartItemModel } from '../../../../cart/infraestructure/database/models/cart-item.model';

export enum UserType {
  VIP = 'VIP',
  COMMON = 'COMMON',
  ADMIN = 'ADMIN',
}

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserType)),
    allowNull: false,
    defaultValue: UserType.COMMON,
  })
  type: UserType;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @HasMany(() => CartItemModel)
  cartItems: CartItemModel[];
}
