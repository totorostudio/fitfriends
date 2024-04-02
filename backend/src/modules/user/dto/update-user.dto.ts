import { UserRole } from 'src/libs/types';
import { UpdateCustomerDto, UpdateCoachDto } from '.';

export const UpdateUserDto = {
  [UserRole.Customer]: UpdateCustomerDto,
  [UserRole.Coach]: UpdateCoachDto,
};

export type UpdateUserDtoType = typeof UpdateUserDto;
