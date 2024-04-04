import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserRole } from 'src/libs/types';
import { Role } from 'src/libs/decorators/role.decorator';
import { BaseQuery } from 'src/libs/query/base-query';
import { UsersRdo, UsersRdoExample } from 'src/modules/user/rdo';
import { UserDtoValidationPipe } from 'src/libs/pipes/user-dto-validation.pipe';
import { UUIDValidationPipe } from 'src/libs/pipes/uuid-validation.pipe';
import { UsersQuery } from 'src/modules/user/user.query';
import { CURRENT_USER } from 'src/app.const';
import { UpdateFriendsDto } from './dto/update-friends.dto';
import { UpdateFriendsRdo } from './rdo/update-friends.rdo';

@ApiTags('Друзья') //TODO нет защиты от повторных удалений/добавлений
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiResponse({
    schema: {
      example: UsersRdoExample
    },
    status: HttpStatus.OK,
    description: 'Список всех друзей пользователя',
  })
  @Role(UserRole.Customer)
  @Get('/')
  public async index(@Query() query: BaseQuery): Promise<UsersRdo> {
    return this.friendsService.getFriends(CURRENT_USER, query);
  }

  @ApiBody({ type: UpdateFriendsDto })
  @ApiResponse({
    type: UpdateFriendsRdo,
    status: HttpStatus.OK,
    description: 'Пользователь добавлен в друзья',
  })
  @Post('/add')
  public async add(@Body() dto: UpdateFriendsDto) {
    return this.friendsService.addFriend(CURRENT_USER, dto);
  }

  @ApiBody({ type: UpdateFriendsDto })
  @ApiResponse({
    type: UpdateFriendsRdo,
    status: HttpStatus.OK,
    description: 'Пользователь удален из друзей',
  })
  @Post('/remove')
  public async remove(@Body() dto: UpdateFriendsDto) {
    return this.friendsService.removeFriend(CURRENT_USER, dto);
  }
}
