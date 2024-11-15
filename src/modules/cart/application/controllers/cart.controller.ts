import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UseGuards,
} from '@nestjs/common';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { CartService } from '../services/cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { UserTypeDecorator } from 'src/common/decorators/user-type.decorator';
import { UserType } from 'src/modules/user/infraestructure/database/models/user.model';

@Controller('cart-items')
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @Post()
  @Version('1')
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  @Version('1')
  addOrUpdateCartItem(
    @UserId() userId: number,
    @Body() createCartDto: CreateCartDto,
  ) {
    return this.cartsService.addOrUpdateCartItem(
      userId,
      createCartDto.productId,
      createCartDto.quantity,
    );
  }

  @Get()
  @Version('1')
  findAll() {
    return this.cartsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/session')
  @Version('1')
  findAllByUserId(
    @UserId() userId: number,
    @UserTypeDecorator() userType: UserType,
  ) {
    return this.cartsService.findAllByUserId(userId, userType);
  }

  @Get('/totals')
  @Version('1')
  getTotals() {
    return this.cartsService.getTotals();
  }

  @Get(':id')
  @Version('1')
  findById(@Param('id') id: number) {
    return this.cartsService.findById(id);
  }

  @Patch(':id')
  @Version('1')
  update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(id, updateCartDto);
  }

  @Delete(':id')
  @Version('1')
  remove(@Param('id') id: number) {
    return this.cartsService.remove(id);
  }
}
