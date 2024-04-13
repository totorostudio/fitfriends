import { Controller, Get, Param, Delete, HttpStatus } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CURRENT_USER_ID } from 'src/app.const';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { NotifyRdo } from './rdo';

@ApiTags('Оповещения')
@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @ApiResponse({
    type: [NotifyRdo],
    status: HttpStatus.OK,
    description: 'User`s notifications',
  })
  @Get()
  public async find() {
    return this.notifyService.find(CURRENT_USER_ID);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The notification has been successfully deleted',
  })
  @Delete(':id')
  public async delete(
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    await this.notifyService.remove(id, CURRENT_USER_ID);
  }
}
