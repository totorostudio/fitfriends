import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserRole } from 'src/libs/types';
import { Role } from 'src/libs/decorators/role.decorator';
import { BaseQuery } from 'src/libs/query/base-query';
import { UsersRdo } from './rdo';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    type: UsersRdo,
    status: HttpStatus.OK,
    description: 'Список пользователей',
  })
  @Role(UserRole.Customer)
  @Get('/')
  public async index(@Query() query: BaseQuery) {
    return this.userService.getAllUsers(query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь найден',
  })
  @Get('/:userId')
  public async show(@Param('userId') id: string) {
    return this.userService.getUserById(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Данные пользователя успешно изменены',
  })
  @Patch('/:userId')
  public async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }
}
