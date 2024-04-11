import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { UserService } from 'src/modules/user/user.service';
import { BookingRdo } from './rdo';
import { DEFAULT_BOOKING_STATUS } from 'src/app.const';
import { fillDto } from 'src/libs/helpers';
import { BookingEntity } from './booking.entity';
import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userService: UserService,
  ) {}

  public async create(senderId: string, { recipientId }: CreateBookingDto): Promise<BookingRdo> {
    if (senderId === recipientId) {
      throw new BadRequestException(
        `Вы не можете отправить заявку на тренировку самому себе`,
      );
    }

    if (await this.bookingRepository.isPending(senderId, recipientId)) {
      throw new ConflictException(
        `Заявка на тренировку уже отправлена и ожидает`,
      );
    }

    const recipient = await this.userService.getUserEntity(recipientId);
    if (!recipient.isReady) {
      throw new BadRequestException(
        `Пользователь с ID ${recipientId} не готов тренироваться`,
      );
    }

    const newBooking = {
      senderId: senderId,
      recipientId: recipientId,
      status: DEFAULT_BOOKING_STATUS,
    };

    const bookingEntity = new BookingEntity(newBooking);
    const booking = await this.bookingRepository.save(bookingEntity);

    return fillDto(BookingRdo, booking.toPOJO());
  }

  public async update(currentUserId: string, bookingId: string, { status }: UpdateBookingDto): Promise<BookingRdo> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundException(
        `Workout request with id ${bookingId} not found.`,
      );
    }

    if (currentUserId !== booking.recipientId || currentUserId !== booking.senderId) {
      throw new ForbiddenException();
    }

    if (booking.status === status) {
      throw new ConflictException(
        `Текущий статус заявки на тренировку уже ${status}`,
      );
    }

    booking.status = status;

    const updated_booking = await this.bookingRepository.update(bookingId, booking);

    return fillDto(BookingRdo, updated_booking.toPOJO());
  }

  public async find(currentUserId: string): Promise<BookingRdo[]> {
    const bookingEntities = await this.bookingRepository.find(currentUserId);

    return bookingEntities;
  }

}
