import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Controller } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { RabbitRouting } from "src/libs/types";
import { MailUserDto } from "../subscribe/dto";

@Controller()
export class RabbitController {
  constructor(
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: 'fitfriends.income',
    routingKey: RabbitRouting.SendTest,
    queue: 'fitfriends.income',
  })
  public async sendTestRabbit(emailData: MailUserDto) {
    this.mailService.sendTest(emailData);
  }
}
