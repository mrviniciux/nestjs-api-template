import { CreateCartDto } from '../../application/dto/create-cart.dto';
import { UpdateCartDto } from '../../application/dto/update-cart.dto';
import { CartItem } from '../entities/cart-item.entity';

export const CART_REPOSITORY = Symbol('ICartRepository');

export interface ICartRepository {
  create(createCartDto: CreateCartDto): Promise<CartItem>;
  findById(id: number): Promise<CartItem | null>;
  findExistent(userId: number, productId: number): Promise<CartItem | null>;
  findAllByUserId(userId: number): Promise<CartItem[] | null>;
  update(id: number, updateCartDto: UpdateCartDto): Promise<CartItem>;
  delete(id: number): Promise<{ message: string }>;
  findAll(): Promise<CartItem[]>;
}
