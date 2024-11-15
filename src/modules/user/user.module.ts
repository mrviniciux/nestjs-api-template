import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './application/controllers/user.controller';

import { UserService } from './application/services/user.service';
import { UserRepositoryImpl } from './infraestructure/repositories/user.repository.impl';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { UserModel } from './infraestructure/database/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
