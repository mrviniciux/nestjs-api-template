import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductModel } from '../database/models/product.model';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { Product } from '../../domain/entities/product.entity';
import { UpdateProductDto } from '../../application/dto/update-product.dto';

@Injectable()
export class ProductRepositoryImpl implements IProductRepository {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productModel.create(createProductDto);
    return product.toJSON() as Product;
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.productModel.findOne({
      where: { id },
    });
    return product ? (product.toJSON() as Product) : null;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await product.update(updateProductDto);

    return product.toJSON() as Product;
  }

  async delete(id: number): Promise<{ message: string }> {
    const product = await this.productModel.findOne({
      where: { id },
    });

    await product.destroy();
    return { message: `Product: ${id} Deleted successfully` };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.findAll();
    return products.map((product) => product.toJSON() as Product);
  }
}
