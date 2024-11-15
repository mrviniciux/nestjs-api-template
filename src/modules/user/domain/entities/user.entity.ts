import { UserType } from '../../infraestructure/database/models/user.model';

export class User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: UserType;
  createdAt?: Date;
  updatedAt?: Date;
}
