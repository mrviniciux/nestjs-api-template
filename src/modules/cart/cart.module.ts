import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItemModel } from './infraestructure/database/models/cart-item.model';
import { CartController } from './application/controllers/cart.controller';
import { CartService } from './application/services/cart.service';
import { CART_REPOSITORY } from './domain/repositories/cart.repository.interface';
import { CartRepositoryImpl } from './infraestructure/repositories/cart.repository.impl';

@Module({
  imports: [SequelizeModule.forFeature([CartItemModel])],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_REPOSITORY,
      useClass: CartRepositoryImpl,
    },
  ],
  exports: [CartService],
})
export class CartModule {}
