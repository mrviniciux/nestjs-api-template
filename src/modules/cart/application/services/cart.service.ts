import { CartItem } from '../../domain/entities/cart-item.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  ICartRepository,
  CART_REPOSITORY,
} from '../../domain/repositories/cart.repository.interface';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import {
  CartTotals,
  ItemsToDiscount,
} from '../../domain/entities/cart-totals.entity';
import { UserType } from 'src/modules/user/infraestructure/database/models/user.model';

export class CartService {
  private readonly vipDiscount: number = 0.15;
  private readonly promotionQtItemsDiscount: number = 3;

  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
  ) {}

  /**
   * Calculate eligible discounts based on promotion rules.
   * @param cartItems - Array of cart items
   * @returns Array of items with calculated discounts
   */
  private calculateDiscounts(cartItems: CartItem[]): ItemsToDiscount[] {
    const sortedItems = cartItems
      .filter((item) => item.quantity > 0)
      .sort((a, b) => a.product.price - b.product.price);

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const discountEligibleQuantity = Math.floor(
      totalQuantity / this.promotionQtItemsDiscount,
    );

    const discounts: ItemsToDiscount[] = [];
    let remainingDiscounts = discountEligibleQuantity;

    for (const item of sortedItems) {
      if (remainingDiscounts <= 0) break;

      const discountQuantity = Math.min(item.quantity, remainingDiscounts);
      const totalDiscount = discountQuantity * item.product.price;

      discounts.push({
        product: item.product,
        productId: item.productId,
        quantity: discountQuantity,
        totalDiscount,
      });

      remainingDiscounts -= discountQuantity;
    }

    return discounts;
  }

  /**
   * Get the total price and discounts of the cart.
   * @returns Object containing the cart totals and discounts
   */
  async getTotals(): Promise<CartTotals> {
    const cartItems = await this.cartRepository.findAll();

    const total = cartItems.reduce(
      (acc, curr) => acc + curr.quantity * curr.product.price,
      0,
    );
    const totalItemsInCart = cartItems.reduce(
      (acc, curr) => acc + curr.quantity,
      0,
    );
    const itemsToBeDiscounted = this.calculateDiscounts(cartItems);

    const promotionDiscountTotal = itemsToBeDiscounted.reduce(
      (sum, item) => sum + item.totalDiscount,
      0,
    );

    const vipDiscountTotal = total * this.vipDiscount;

    return {
      total,
      promotion: {
        total: total - promotionDiscountTotal,
        qtItemsForFree: Math.floor(
          totalItemsInCart / this.promotionQtItemsDiscount,
        ),
      },
      vip: {
        total: total - vipDiscountTotal,
        percentDiscount: this.vipDiscount,
      },
    };
  }

  /**
   * Add or update a cart item based on user and product.
   * @param userId - ID of the user
   * @param productId - ID of the product
   * @param quantity - Quantity of the product to add/update
   * @returns Updated or new cart item
   */
  async addOrUpdateCartItem(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem> {
    const existingCartItem = await this.cartRepository.findExistent(
      userId,
      productId,
    );

    if (existingCartItem) {
      const updatedQuantity = existingCartItem.quantity + quantity;
      const updated = await this.cartRepository.update(existingCartItem.id, {
        quantity: updatedQuantity,
      });

      return this.cartRepository.findById(updated.id);
    } else {
      const created = await this.cartRepository.create({
        userId,
        productId,
        quantity,
      });

      return this.cartRepository.findById(created.id);
    }
  }

  /**
   * Create a new cart item.
   * @param createCartDto - Data for creating the cart item
   * @returns Created cart item
   */
  async create(createCartDto: CreateCartDto): Promise<CartItem> {
    return this.cartRepository.create(createCartDto);
  }

  /**
   * Update an existing cart item.
   * @param id - ID of the cart item to update
   * @param updateCartDto - Updated data for the cart item
   * @returns Updated cart item
   * @throws NotFoundException if cart item not found
   */
  async update(id: number, updateCartDto: UpdateCartDto): Promise<CartItem> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    return this.cartRepository.update(id, updateCartDto);
  }

  /**
   * Remove a cart item by ID.
   * @param id - ID of the cart item to remove
   * @returns Confirmation message
   * @throws NotFoundException if cart item not found
   */
  async remove(id: number): Promise<{ message: string }> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    await this.cartRepository.delete(id);
    return { message: 'Cart item removed successfully' };
  }

  /**
   * Find all cart items.
   * @returns Array of cart items
   */
  async findAll(): Promise<CartItem[]> {
    return this.cartRepository.findAll();
  }

  /**
   * Find a cart item by ID.
   * @param id - ID of the cart item
   * @returns Cart item
   */
  async findById(id: number): Promise<CartItem> {
    return this.cartRepository.findById(id);
  }

  /**
   * Find cart items by userId.
   * @param userId - user id
   * @param type - user type
   * @returns Cart items
   */
  async findAllByUserId(userId: number, type: UserType): Promise<CartItem[]> {
    const cartItems = await this.cartRepository.findAllByUserId(userId);

    return cartItems.map((item) => {
      const total = item.quantity * item.product.price;
      const vipTotal = type === 'VIP' ? total - total * 0.15 : 0;
      return { ...item, total, vipTotal };
    });
  }
}
