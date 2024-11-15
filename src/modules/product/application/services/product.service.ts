import { Product } from '../../domain/entities/product.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepository.delete(id);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findById(id: number): Promise<Product> {
    return this.productRepository.findById(id);
  }
}
