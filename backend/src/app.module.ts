import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './libs/guards';
import { AppConfigModule } from './libs/config';
import { FriendsModule } from './modules/friends/friends.module';
import { TrainingModule } from './modules/training/training.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    UserModule,
    FriendsModule,
    TrainingModule,
    ReviewModule,
    AppConfigModule,
    AuthModule,
    RefreshTokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    /*{
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },*/
  ],
})
export class AppModule {}
