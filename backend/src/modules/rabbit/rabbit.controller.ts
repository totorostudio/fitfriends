import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Controller } from "@nestjs/common";
import { SubscribeService } from "../subscribe/subscribe.service";
import { MailService } from "../mail/mail.service";
import { RabbitRouting } from "src/libs/types";
import { TestUserDto } from "../subscribe/dto";

@Controller()
export class RabbitController {
  constructor(
    private readonly subscribeService: SubscribeService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: 'fitfriends.income',
    routingKey: RabbitRouting.SendTest,
    queue: 'fitfriends.income',
  })
  public async sendTest(emailData: TestUserDto) {
    this.mailService.sendTest(emailData);
  }
}
