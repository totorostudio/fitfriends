import { Controller, Post, Body, Patch, Param, HttpStatus, Get, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { BookingRdo } from './rdo';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { RequestWithTokenPayload } from 'src/libs/requests';

@ApiTags('Заявки на тренировку')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiResponse({
    type: [BookingRdo],
    status: HttpStatus.OK,
    description: 'Список всех заявок пользователя получен.',
  })
  @Get()
  public async find(@Req() { tokenPayload }: RequestWithTokenPayload) {
    return this.bookingService.find(tokenPayload.sub);
  }

  @ApiResponse({
    type: BookingRdo,
    status: HttpStatus.CREATED,
    description: 'Заявка на тренировку успешно добавлена.',
  })
  @Post()
  public async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() { tokenPayload }: RequestWithTokenPayload
  ) {
    return this.bookingService.create(tokenPayload.sub, createBookingDto);
  }

  @ApiResponse({
    type: BookingRdo,
    status: HttpStatus.OK,
    description: 'Статус заявки на тренировку успешно изменен',
  })
  @Patch(':uuid')
  update(
    @Param('uuid', UUIDValidationPipe) uuid: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() { tokenPayload }: RequestWithTokenPayload
  ) {
    return this.bookingService.update(tokenPayload.sub, uuid, updateBookingDto);
  }
}
