import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigType } from '@nestjs/config';
import { EmailTemplate, EmailTitle } from 'src/app.const';
import { mailConfig } from 'src/libs/config';
import { Notice } from 'src/libs/types';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(mailConfig.KEY)
  private readonly mailConfig: ConfigType<typeof mailConfig>;

  public async sendNewSubscription(email: string, userName: string, coachName: string) {
    await this.mailerService.sendMail({
      from: this.mailConfig.from,
      to: email,
      subject: EmailTitle.Subscription,
      template: EmailTemplate.Subscription,
      context: {
        coachName,
        userName,
      },
    });
  }

  public async sendNewTraining(email: string, userName: string, notice: Notice) {
    const { title, type, description, calories, coachName } = notice;

    await this.mailerService.sendMail({
      from: this.mailConfig.from,
      to: email,
      subject: EmailTitle.Training,
      template: EmailTemplate.Training,
      context: {
        userName,
        coachName,
        title,
        type,
        description,
        calories,
      },
    });
  }
}
