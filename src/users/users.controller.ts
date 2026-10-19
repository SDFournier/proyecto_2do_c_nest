import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('active') active?: string, @Query('name') name?: string) {
    return this.usersService.findAll(active, name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
