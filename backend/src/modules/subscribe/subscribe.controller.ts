import { Controller, Post, Param, Delete, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Role } from 'src/libs/decorators';
import { UserRole } from 'src/libs/types';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { RoleGuard } from 'src/libs/guards';
import { RequestWithTokenPayload } from 'src/libs/requests';
import { TEST_USER } from 'src/app.const';

@ApiTags('Уведомления о новых тренировках')
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @ApiOperation({
    summary: 'Отправка тестового почтового сообщения через RabbitMQ',
    description: 'Роут для отправки тестового почтового сообщения через RabbitMQ'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Тестовое сообщение через RabbitMQ отправлено',
  })
  @Public()
  @Post('test-rabbit')
  public async sendTestRabbit() {
    await this.subscribeService.sendTestRabbit(TEST_USER);
  }

  @ApiOperation({
    summary: 'Отправка тестового почтового сообщения напрямую',
    description: 'Роут для отправки тестового почтового сообщения напрямую'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Тестовое сообщение отправлено',
  })
  @Public()
  @Post('test-direct')
  public async sendTestDirect() {
    await this.subscribeService.sendTestDirect(TEST_USER);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уведомления успешно отправлены',
  })
  @Public()
  @Post()
  public async send() {
    await this.subscribeService.sendNotices();
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Подписка на уведомления о новых тренировках тренера успешно добавлена',
  })
  @Role(UserRole.Customer)
  @Post(':coachId')
  public async create(
    @Param('coachId', UUIDValidationPipe) coachId: string,
    @Req() { tokenPayload }: RequestWithTokenPayload,
  ) {
    await this.subscribeService.addNewSubscription(tokenPayload, coachId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Уведомление успешно удалено',
  })
  @Role(UserRole.Customer)
  @UseGuards(RoleGuard)
  @Delete(':coachId')
  public async delete(
    @Param('coachId', UUIDValidationPipe) coachId: string,
    @Req() { tokenPayload }: RequestWithTokenPayload,
  ) {
    await this.subscribeService.removeSubscription(tokenPayload.sub, coachId);
  }
}
