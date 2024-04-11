import { Controller, Post, Body, Patch, Param, HttpStatus, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { CURRENT_USER_ID } from 'src/app.const';
import { BookingRdo } from './rdo';
import { UUIDValidationPipe } from 'src/libs/pipes';

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
  public async find() {
    return this.bookingService.find(CURRENT_USER_ID);
  }

  @ApiResponse({
    type: BookingRdo,
    status: HttpStatus.CREATED,
    description: 'Заявка на тренировку успешно добавлена.',
  })
  @Post()
  public async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(CURRENT_USER_ID, createBookingDto);
  }

  @ApiResponse({
    type: BookingRdo,
    status: HttpStatus.OK,
    description: 'Статус заявки на тренировку успешно изменен',
  })
  @Patch(':uuid')
  update(@Param('uuid', UUIDValidationPipe) uuid: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(CURRENT_USER_ID, uuid, updateBookingDto);
  }
}
