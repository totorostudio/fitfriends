import { UserRole } from "src/libs/types";
import { CreateCustomerDto } from "./create-customer.dto";
import { CreateCoachDto } from "./create-coach.dto";

export const CreateUserDto = {
  [UserRole.Customer]: CreateCustomerDto,
  [UserRole.Coach]: CreateCoachDto,
};

//export type CreateUserDtoType = typeof CreateUserDto;

export type CreateUserDtoType = CreateCustomerDto | CreateCoachDto;
