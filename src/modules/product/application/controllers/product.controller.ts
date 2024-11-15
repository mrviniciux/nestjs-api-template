import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @Version('1')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Version('1')
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Version('1')
  findById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  @Version('1')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Version('1')
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
