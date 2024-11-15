export class CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
