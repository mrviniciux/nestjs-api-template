'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('products', [
      {
        title: 'T-Shirt',
        img: '/t-shirt.webp',
        price: 35.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Jeans',
        img: '/jeans.webp',
        price: 65.6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Dress',
        img: '/dress.webp',
        price: 80.75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('products', { title: 'Jeans' }, {});
  },
};
