import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../../services/cart.service';
import {
  CART_REPOSITORY,
  ICartRepository,
} from '../../../domain/repositories/cart.repository.interface';
import { createCartDtoMock } from '../../../__mock__/cart.mock';

describe('CartsController', () => {
  let controller: CartController;
  let repository: ICartRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: CART_REPOSITORY,
          useValue: {
            create: jest.fn(),
            addOrUpdateCartItem: jest.fn(),
            findExistent: jest.fn(),
            findById: jest.fn(),
            getTotals: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    repository = module.get(CART_REPOSITORY);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST should create a new cart item', async () => {
    jest.spyOn(repository, 'create').mockResolvedValue(createCartDtoMock);
    const resp = await controller.create(createCartDtoMock);

    expect(resp).toBe(createCartDtoMock);
    expect(repository.create).toHaveBeenCalled();
  });

  it('POST checkout should add or update items', async () => {
    jest
      .spyOn(repository, 'update')
      .mockResolvedValue({ ...createCartDtoMock, quantity: 2 });

    jest.spyOn(repository, 'findExistent').mockResolvedValue(createCartDtoMock);

    await controller.addOrUpdateCartItem(1, createCartDtoMock);

    expect(repository.update).toHaveBeenCalled();
  });

  it('GET find all', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([createCartDtoMock]);

    const resp = await controller.findAll();

    expect(resp).toHaveLength(1);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('GET find by id', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(createCartDtoMock);

    const resp = await controller.findById(createCartDtoMock.id);

    expect(resp).toBe(createCartDtoMock);
    expect(repository.findById).toHaveBeenCalled();
  });

  it('GET totals', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([createCartDtoMock]);

    const resp = await controller.getTotals();

    expect(resp.total).toBe(66);
    expect(resp.promotion.qtItemsForFree).toBe(0);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('PATCH id should update an item', async () => {
    const updatedValue = { ...createCartDtoMock, quantity: 2 };
    jest.spyOn(repository, 'findById').mockResolvedValue(createCartDtoMock);
    jest.spyOn(repository, 'update').mockResolvedValue(updatedValue);

    const resp = await controller.update(createCartDtoMock.id, { quantity: 2 });

    expect(resp).toBe(updatedValue);
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });

  it('DELETE cart', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(createCartDtoMock);
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ message: 'Cart item removed successfully' });

    const resp = await controller.remove(1);

    expect(resp.message).toBe('Cart item removed successfully');
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.delete).toHaveBeenCalled();
  });
});
