import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/user/user.service';
import { RefreshTokenService } from 'src/modules/refresh-token/refresh-token.service';
import { Public } from 'src/libs/decorators';
import { UserDtoValidationPipe } from 'src/libs/pipes';
import { JwtRefreshGuard, LocalAuthGuard, NotAuthGuard } from 'src/libs/guards';
import { AuthUserRdo, LoggedUserRdo } from './rdo';
import { RequestWithRefreshTokenPayload, RequestWithTokenPayload, RequestWithUser } from 'src/libs/requests';
import { CreateUserDto, CreateUserDtoType } from './dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @ApiResponse({
    type: AuthUserRdo,
    status: HttpStatus.CREATED,
    description: 'Новый пользователь успешно создан.',
  })
  @Public()
  @UseGuards(NotAuthGuard)
  @Post('register')
  public async create(
    @Body(new UserDtoValidationPipe(CreateUserDto)) dto: CreateUserDtoType,
  ) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'Успешный вход в систему',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Логин или пароль неверны',
  })
  @Public()
  @UseGuards(NotAuthGuard, LocalAuthGuard)
  @Post('login')
  public async login(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'Пользователь авторизирован.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизирован.',
  })
  @Get('login')
  public async checkAuth(@Req() { tokenPayload }: RequestWithTokenPayload) {
    return this.userService.getUserByEmail(tokenPayload.email);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно вышел.',
  })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Delete('logout')
  public async logout(@Req() { tokenPayload }: RequestWithRefreshTokenPayload) {
    await this.refreshTokenService.deleteRefreshSession(tokenPayload.tokenId);
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'Получить новые access/refresh токены',
  })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Req() { tokenPayload }: RequestWithRefreshTokenPayload,
  ) {
    return this.authService.refreshUserToken(tokenPayload);
  }
}
