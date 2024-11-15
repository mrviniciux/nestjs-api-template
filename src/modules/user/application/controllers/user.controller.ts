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
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @Version('1')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Version('1')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Version('1')
  findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Version('1')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Version('1')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
