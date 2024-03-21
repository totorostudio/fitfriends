import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/libs/models';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaClientService,
  ) {}

  getHello(): string {
    return 'Hello User!';
  }

  getUsers() {
    return this.prismaService.user.findMany();
  }
}
