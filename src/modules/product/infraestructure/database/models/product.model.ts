import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class ProductModel extends Model<ProductModel> {
  @Column
  title: string;

  @Column
  img: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
