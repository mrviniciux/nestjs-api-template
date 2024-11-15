import { IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  productId?: number;

  @IsString()
  userId?: number;

  @IsString()
  quantity?: number;
}
