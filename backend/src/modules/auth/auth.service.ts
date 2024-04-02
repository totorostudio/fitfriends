import { ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import dayjs from "dayjs";
import { UserRepository } from "src/modules/user/user.repository";
import { UserService } from "src/modules/user/user.service";
import { RefreshTokenService } from "src/modules/refresh-token/refresh-token.service";
import { UserEntity } from "src/modules/user/user.entity";
import { jwtConfig } from "src/libs/config";
import { CreateCoachDto, CreateCustomerDto, CreateUserDtoType, LoginUserDto } from "./dto";
import { AuthUserRdo, LoggedUserRdo } from "./rdo";
import { createJWTPayload, fillDto } from "src/libs/helpers";
import { RefreshTokenPayload } from "src/libs/types";
import { UserMessage } from "src/libs/messages";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async register(dto: CreateUserDtoType): Promise<AuthUserRdo> {
    const {
      email,
      name,
      avatar,
      gender,
      birthday,
      userRole,
      description,
      metro,
      background,
      level,
      trainingType,
      isReady,
      password,
    } = dto;

    const existedUser = (await this.userRepository.findByEmail(email));

    if (existedUser) {
      throw new ConflictException(UserMessage.Exists);
    }

    const newUser = {
      createdAt: new Date(),
      email,
      name,
      avatar,
      gender,
      birthday: birthday ? dayjs(birthday).toDate() : undefined,
      userRole,
      description,
      metro,
      background: background ?? avatar,
      level,
      trainingType,
      isReady,
      password: '',
    };

    const customerUserInfo =
      dto instanceof CreateCustomerDto
        ? {
            calories: dto.calories,
            caloriesPerDay: dto.caloriesPerDay,
            trainingTime: dto.trainingTime,
          }
        : {};

    const coachUserInfo =
      dto instanceof CreateCoachDto
        ? {
            certificate: dto.certificate,
            awards: dto.awards,
          }
        : {};

    const userEntity = await new UserEntity(
      Object.assign(newUser, customerUserInfo, coachUserInfo),
    ).setPassword(password);

    const user = await this.userRepository.save(userEntity);
    return fillDto(AuthUserRdo, user.toPOJO());
  }

  public async verifyUser(dto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = dto;
    const existUser = await this.userRepository.findByEmail(email) as UserEntity;

    if (!existUser) {
      throw new NotFoundException(UserMessage.NotFound);
    }

    if (!(await existUser.comparePassword(password))) {
      throw new UnauthorizedException(UserMessage.PasswordWrong);
    }

    return existUser;
  }

  public async refreshUserToken(
    payload: RefreshTokenPayload,
  ): Promise<LoggedUserRdo> {
    await this.refreshTokenService.deleteRefreshSession(payload.tokenId);
    const user = await this.userService.getUserEntity(payload.sub);
    return this.createUserToken(user);
  }

  public async createUserToken(user: UserEntity): Promise<LoggedUserRdo> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
    };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        {
          secret: this.jwtOptions.refreshTokenSecret,
          expiresIn: this.jwtOptions.refreshTokenExpiresIn,
        },
      );

      return fillDto(LoggedUserRdo, {
        ...user.toPOJO(),
        accessToken,
        refreshToken,
      });
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);
      throw new HttpException(
        'Ошибка при создании токена.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
