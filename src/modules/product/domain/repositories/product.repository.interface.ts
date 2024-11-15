import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
  delete(id: number): Promise<{ message: string }>;
  findAll(): Promise<Product[]>;
}
