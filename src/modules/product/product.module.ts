import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel } from './infraestructure/database/models/product.model';
import { ProductController } from './application/controllers/product.controller';
import { ProductService } from './application/services/product.service';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { ProductRepositoryImpl } from './infraestructure/repositories/product.repository.impl';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImpl,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
