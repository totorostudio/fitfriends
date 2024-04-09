import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserRole } from 'src/libs/types';
import { Role } from 'src/libs/decorators/role.decorator';
import { BaseQuery } from 'src/libs/query/base-query';
import { FullUserRdo, UsersRdo, UsersRdoExample } from './rdo';
import { BaseUserDto, UpdateUserDto, UpdateUserDtoType } from './dto';
import { UserDtoValidationPipe } from 'src/libs/pipes';
import { UUIDValidationPipe } from 'src/libs/pipes/uuid-validation.pipe';
import { UsersQuery } from './user.query';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    schema: {
      example: UsersRdoExample
    },
    status: HttpStatus.OK,
    description: 'Список пользователей',
  })
  @Role(UserRole.Customer)
  @Get('/')
  public async index(@Query() query: UsersQuery): Promise<UsersRdo> {
    return this.userService.getAllUsers(query);
  }

  @ApiResponse({
    type: FullUserRdo,
    status: HttpStatus.OK,
    description: 'Пользователь найден',
  })
  @Get('/:userId')
  public async show(@Param('userId', UUIDValidationPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @ApiBody({ type: BaseUserDto })
  @ApiResponse({
    type: FullUserRdo,
    status: HttpStatus.OK,
    description: 'Данные пользователя успешно изменены',
  })
  @Patch('/:userId')
  public async update(@Param('userId') userId: string, @Body(new UserDtoValidationPipe(UpdateUserDto)) dto: UpdateUserDtoType) {
    return this.userService.updateUser(userId, dto);
  }
}
