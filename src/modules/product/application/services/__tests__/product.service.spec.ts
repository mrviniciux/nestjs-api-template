import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository.interface';
import {
  createProductDtoMock,
  updateProductMock,
} from '../../../__mock__/product.mock';

describe('Product service and repository', () => {
  let productService: ProductService;
  let productRepository: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get(PRODUCT_REPOSITORY);
  });

  it('should both be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      jest
        .spyOn(productService, 'create')
        .mockResolvedValue(createProductDtoMock);

      expect(await productService.create(createProductDtoMock)).toEqual(
        createProductDtoMock,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const updatedProduct = { ...createProductDtoMock, ...updateProductMock };
      jest.spyOn(productService, 'update').mockResolvedValue(updatedProduct);

      expect(await productService.update(1, updateProductMock)).toEqual(
        updatedProduct,
      );
    });
    it('should throw an error since product doesnt exists', () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValue(null);

      expect(productService.update(1, {})).rejects.toThrow('Product not found');
    });

    it.todo('should revoke update since logged product isnt admin');
  });

  describe('removeProduct', () => {
    it('should remove product', async () => {
      const objMessage = { message: `Product: 1 Deleted successfully` };
      jest.spyOn(productService, 'remove').mockResolvedValue(objMessage);

      expect(await productService.remove(1)).toBe(objMessage);
    });

    it('should throw an error since product doesnt exists', () => {
      expect(productService.remove(1)).rejects.toThrow('Product not found');
    });

    it.todo('should revoke update since logged product isnt admin');
  });
});
