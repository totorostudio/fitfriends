import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/libs/types';
import { Role } from 'src/libs/decorators/role.decorator';
import { BaseQuery } from 'src/libs/query/base-query';
import { UsersRdo, UsersRdoExample } from 'src/modules/user/rdo';
import { UserDtoValidationPipe } from 'src/libs/pipes';
import { UUIDValidationPipe } from 'src/libs/pipes/uuid-validation.pipe';
import { UsersQuery } from 'src/modules/user/user.query';
import { UpdateFriendsDto } from './dto/update-friends.dto';
import { UpdateFriendsRdo } from './rdo/update-friends.rdo';
import { RequestWithTokenPayload } from 'src/libs/requests';

@ApiTags('Друзья') //TODO нет защиты от повторных удалений/добавлений
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOperation({
    summary: 'Получить список всех друзей пользователя'
  })
  @ApiResponse({
    schema: {
      example: UsersRdoExample
    },
    status: HttpStatus.OK,
    description: 'Список всех друзей пользователя',
  })
  @ApiBearerAuth('access-token')
  @Get('/')
  public async index(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Query() query: BaseQuery
  ): Promise<UsersRdo> {
    return this.friendsService.getFriends(tokenPayload.sub, query);
  }

  @ApiOperation({
    summary: 'Добавить в друзья'
  })
  @ApiBody({ type: UpdateFriendsDto })
  @ApiResponse({
    type: UpdateFriendsRdo,
    status: HttpStatus.OK,
    description: 'Пользователь добавлен в друзья',
  })
  @ApiBearerAuth('access-token')
  @Post('/add')
  public async add(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Body() dto: UpdateFriendsDto
  ) {
    return this.friendsService.addFriend(tokenPayload.sub, dto);
  }

  @ApiOperation({
    summary: 'Удалить из друзей'
  })
  @ApiBody({ type: UpdateFriendsDto })
  @ApiResponse({
    type: UpdateFriendsRdo,
    status: HttpStatus.OK,
    description: 'Пользователь удален из друзей',
  })
  @ApiBearerAuth('access-token')
  @Post('/remove')
  public async remove(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Body() dto: UpdateFriendsDto
  ) {
    return this.friendsService.removeFriend(tokenPayload.sub, dto);
  }
}
