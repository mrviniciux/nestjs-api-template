import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductModel } from '../../../../product/infraestructure/database/models/product.model';
import { UserModel } from '../../../../user/infraestructure/database/models/user.model';

@Table({ tableName: 'cart-items' })
export class CartItemModel extends Model<CartItemModel> {
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  productId: number;

  @Column
  quantity: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
