import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../../services/product.service';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository.interface';
import { createProductDtoMock } from '../../../__mock__/product.mock';

describe('ProductsController', () => {
  let controller: ProductController;
  let repository: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    repository = module.get(PRODUCT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST should create a new product', async () => {
    jest.spyOn(repository, 'create').mockResolvedValue(createProductDtoMock);
    const resp = await controller.create(createProductDtoMock);

    expect(resp).toBe(createProductDtoMock);
    expect(repository.create).toHaveBeenCalled();
  });

  it('GET find all', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([createProductDtoMock]);

    const resp = await controller.findAll();

    expect(resp).toHaveLength(1);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('GET find by id', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(createProductDtoMock);

    const resp = await controller.findById(1);

    expect(resp).toBe(createProductDtoMock);
    expect(repository.findById).toHaveBeenCalled();
  });

  it('PATCH id should update an item', async () => {
    const updatedValue = { ...createProductDtoMock, title: 'Camisa 2' };
    jest.spyOn(repository, 'findById').mockResolvedValue(createProductDtoMock);
    jest.spyOn(repository, 'update').mockResolvedValue(updatedValue);

    const resp = await controller.update(1, { title: 'Camisa 2' });

    expect(resp).toBe(updatedValue);
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });

  it('DELETE product', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(createProductDtoMock);
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ message: 'product removed successfully' });

    const resp = await controller.remove(1);

    expect(resp.message).toBe('product removed successfully');
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.delete).toHaveBeenCalled();
  });
});
