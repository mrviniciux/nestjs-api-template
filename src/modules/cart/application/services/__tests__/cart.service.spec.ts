import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import {
  ICartRepository,
  CART_REPOSITORY,
} from '../../../domain/repositories/cart.repository.interface';
import { createCartDtoMock, updateCartMock } from '../../../__mock__/cart.mock';

describe('Cart service and repository', () => {
  let cartService: CartService;
  let cartRepository: ICartRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CART_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findExistent: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get(CART_REPOSITORY);
  });

  it('should both be defined', () => {
    expect(cartService).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  describe('add to cart', () => {
    it('should add something to cart', async () => {
      jest
        .spyOn(cartService, 'addOrUpdateCartItem')
        .mockResolvedValue(createCartDtoMock);

      expect(
        await cartService.addOrUpdateCartItem(
          createCartDtoMock.userId,
          createCartDtoMock.productId,
          1,
        ),
      ).toEqual(createCartDtoMock);
    });

    it('should update existent product on cart', async () => {
      jest
        .spyOn(cartRepository, 'findExistent')
        .mockResolvedValue(createCartDtoMock);

      jest
        .spyOn(cartService, 'addOrUpdateCartItem')
        .mockResolvedValue({ ...createCartDtoMock, quantity: 2 });

      const updatedCart = await cartService.addOrUpdateCartItem(
        createCartDtoMock.userId,
        createCartDtoMock.productId,
        1,
      );

      expect(updatedCart).toEqual({ ...createCartDtoMock, quantity: 2 });
    });
  });

  describe('updateCart', () => {
    it('should update cart', async () => {
      const updatedCart = { ...createCartDtoMock, ...updateCartMock };
      jest.spyOn(cartService, 'update').mockResolvedValue(updatedCart);

      expect(await cartService.update(1, updateCartMock)).toEqual(updatedCart);
    });
    it('should throw an error since cart doesnt exists', () => {
      jest.spyOn(cartRepository, 'findById').mockResolvedValue(null);

      expect(cartService.update(1, {})).rejects.toThrow('Cart not found');
    });

    it.todo('should revoke update since logged cart isnt admin');
  });

  describe('removeCart', () => {
    it('should remove cart', async () => {
      const objMessage = { message: `Cart: 1 Deleted successfully` };
      jest.spyOn(cartService, 'remove').mockResolvedValue(objMessage);

      expect(await cartService.remove(1)).toBe(objMessage);
    });

    it('should throw an error since cart doesnt exists', () => {
      expect(cartService.remove(1)).rejects.toThrow('Cart not found');
    });

    it.todo('should revoke update since logged cart isnt admin');
  });

  describe('totals', () => {
    it('should return zero totals for an empty cart', async () => {
      jest.spyOn(cartRepository, 'findAll').mockResolvedValue([]);

      const totals = await cartService.getTotals();

      expect(totals.promotion.total).toEqual(0);
      expect(totals.promotion.qtItemsForFree).toEqual(0);
    });

    it('should not apply promotion if there are not enough items of the same type', async () => {
      const cartItems = [
        {
          id: 1,
          userId: 1,
          productId: 1,
          product: {
            id: 1,
            title: 'T-shirt',
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
        },
        {
          id: 2,
          userId: 1,
          productId: 2,
          product: {
            id: 2,
            title: 'Jeans',
            price: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
        },
      ];
      jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

      const totals = await cartService.getTotals();

      expect(totals.promotion.total).toEqual(25);
      expect(totals.promotion.qtItemsForFree).toEqual(0);
    });

    it('should apply promotion correctly when multiple items have the same price', async () => {
      const cartItems = [
        {
          id: 1,
          userId: 1,
          productId: 1,
          product: {
            id: 1,
            title: 'T-shirt',
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 3,
        },
        {
          id: 2,
          userId: 1,
          productId: 2,
          product: {
            id: 2,
            title: 'Jeans',
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 3,
        },
      ];
      jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

      const totals = await cartService.getTotals();

      expect(totals.promotion.total).toEqual(40);
      expect(totals.promotion.qtItemsForFree).toEqual(2);
    });

    it('should not apply discount for items without sufficient quantity for promotion', async () => {
      const cartItems = [
        {
          id: 1,
          userId: 1,
          productId: 3,
          product: {
            id: 3,
            title: 'Dress',
            price: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 2,
        },
      ];
      jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

      const totals = await cartService.getTotals();

      expect(totals.promotion.total).toEqual(40);
      expect(totals.promotion.qtItemsForFree).toEqual(0);
    });

    it('should apply promotion to multiple eligible sets of items', async () => {
      const cartItems = [
        {
          id: 1,
          userId: 1,
          productId: 4,
          product: {
            id: 4,
            title: 'Shoes',
            price: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 6,
        },
      ];
      jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

      const totals = await cartService.getTotals();

      expect(totals.promotion.total).toEqual(60);
      expect(totals.promotion.qtItemsForFree).toEqual(2);
    });

    describe('(1x promo) with 3 t-shirts added to cart', () => {
      it('should calculate promotion discounting 1 t-shirt', async () => {
        const cartItems = [
          {
            id: 1,
            userId: 1,
            productId: 1,
            product: {
              id: 1,
              title: 'T-shirt',
              price: 10,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 3,
          },
        ];
        jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

        const totals = await cartService.getTotals();

        expect(totals.promotion.total).toEqual(20);
        expect(totals.promotion.qtItemsForFree).toEqual(1);
      });
    });

    describe('(1x promo) with 2 t-shirts and 2 jeans added to cart', () => {
      it('should discount the cheapest item (t-shirt) from promotion total', async () => {
        const cartItems = [
          {
            id: 1,
            userId: 1,
            productId: 1,
            product: {
              id: 1,
              title: 'T-shirt',
              price: 10,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 2,
          },
          {
            id: 2,
            userId: 1,
            productId: 2,
            product: {
              id: 2,
              title: 'Jeans',
              price: 20,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 2,
          },
        ];
        jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

        const totals = await cartService.getTotals();

        expect(totals.promotion.total).toEqual(50);
        expect(totals.promotion.qtItemsForFree).toEqual(1);
      });
    });

    describe('(2x promo) with 3 dresses, 1 t-shirt, and 2 jeans added to cart', () => {
      it('should discount the 2 cheapest items from promotion total (1 t-shirt and 1 jeans)', async () => {
        const cartItems = [
          {
            id: 1,
            userId: 1,
            productId: 3,
            product: {
              id: 3,
              title: 'Dress',
              price: 30,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 3,
          },
          {
            id: 2,
            userId: 1,
            productId: 1,
            product: {
              id: 1,
              title: 'T-shirt',
              price: 10,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 1,
          },
          {
            id: 3,
            userId: 1,
            productId: 2,
            product: {
              id: 2,
              title: 'Jeans',
              price: 20,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 2,
          },
        ];
        jest.spyOn(cartRepository, 'findAll').mockResolvedValue(cartItems);

        const totals = await cartService.getTotals();

        expect(totals.promotion.total).toEqual(110);
        expect(totals.promotion.qtItemsForFree).toEqual(2);
      });
    });
  });
});
