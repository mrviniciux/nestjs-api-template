import { IsString, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsString()
  quantity?: number;
}
