import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ICartRepository } from '../../domain/repositories/cart.repository.interface';
import { CartItemModel } from '../database/models/cart-item.model';
import { CreateCartDto } from '../../application/dto/create-cart.dto';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { UpdateCartDto } from '../../application/dto/update-cart.dto';
import { ProductModel } from '../../../product/infraestructure/database/models/product.model';

@Injectable()
export class CartRepositoryImpl implements ICartRepository {
  constructor(
    @InjectModel(CartItemModel)
    private readonly cartModel: typeof CartItemModel,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<CartItem> {
    const cart = await this.cartModel.create(createCartDto);
    return cart.toJSON() as CartItem;
  }

  async findExistent(userId: number, productId: number): Promise<CartItem> {
    const cartItem = await this.cartModel.findOne({
      where: { userId, productId },
      include: [ProductModel],
    });

    return cartItem ? (cartItem.toJSON() as CartItem) : null;
  }

  async findById(id: number): Promise<CartItem | null> {
    const cart = await this.cartModel.findOne({
      where: { id },
      include: [ProductModel],
    });
    return cart ? (cart.toJSON() as CartItem) : null;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<CartItem> {
    const cart = await this.cartModel.findOne({
      where: { id },
      include: [ProductModel],
    });

    if (!cart) {
      throw new Error('Cart items not found');
    }

    await cart.update(updateCartDto);

    return cart.toJSON() as CartItem;
  }

  async delete(id: number): Promise<{ message: string }> {
    const cart = await this.cartModel.findOne({
      where: { id },
    });

    await cart.destroy();
    return { message: `Cart item: ${id} Deleted successfully` };
  }

  async findAll(): Promise<CartItem[]> {
    const carts = await this.cartModel.findAll({
      include: [{ model: ProductModel }],
    });
    return carts.map((cart) => cart.toJSON() as CartItem);
  }

  async findAllByUserId(userId: number): Promise<CartItem[]> {
    const carts = await this.cartModel.findAll({
      include: [{ model: ProductModel }],
      where: { userId },
    });
    return carts.map((cart) => cart.toJSON() as CartItem);
  }
}
