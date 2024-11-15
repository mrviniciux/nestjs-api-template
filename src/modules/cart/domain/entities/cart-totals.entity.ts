import { Product } from '../../../product/domain/entities/product.entity';
export class CartTotals {
  total: number;
  promotion: {
    total: number;
    qtItemsForFree: number;
  };
  vip: {
    total: number;
    percentDiscount: number;
  };
}

export class ItemsToDiscount {
  product: Product;
  productId: number;
  quantity: number;
  totalDiscount: number;
}
