import { Controller, Get, Param, Delete, HttpStatus, Req } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { NotifyRdo } from './rdo';
import { RequestWithTokenPayload } from 'src/libs/requests';

@ApiTags('Оповещения')
@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @ApiResponse({
    type: [NotifyRdo],
    status: HttpStatus.OK,
    description: 'Список 5 последних оповещений пользователя',
  })
  @Get()
  public async find(@Req() { tokenPayload }: RequestWithTokenPayload) {
    return this.notifyService.find(tokenPayload.sub);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Оповещение успешно удалено',
  })
  @Delete(':id')
  public async delete(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    await this.notifyService.remove(id, tokenPayload.sub);
  }
}
