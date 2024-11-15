'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Insere um usuário ADMIN
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Ademir',
        lastName: 'Corp',
        email: 'admin@whatsapp.com',
        password: '123',
        type: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Ademir',
        lastName: 'VIP',
        email: 'vip@whatsapp.com',
        password: '123',
        type: 'VIP',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Ademir',
        lastName: 'Common',
        email: 'common@whatsapp.com',
        password: '123',
        type: 'COMMON',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    // Remove o usuário ADMIN
    return queryInterface.bulkDelete('Users', { firstName: 'Ademir' });
  },
};
