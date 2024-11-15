export const createCartDtoMock = {
  id: 1,
  userId: 1,
  productId: 2,
  quantity: 1,
  product: {
    id: 2,
    title: 'Jeans',
    price: 66,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const updateCartMock = {
  quantity: 3,
};
