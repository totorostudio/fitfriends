import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigType } from '@nestjs/config';
import { MailTemplate, MailSubject } from 'src/app.const';
import { mailConfig } from 'src/libs/config';
import { Notice } from 'src/libs/types';
import { TestUserDto } from '../subscribe/dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  @Inject(mailConfig.KEY)
  private readonly mailConfig: ConfigType<typeof mailConfig>;

  public async sendTest(emailData: TestUserDto) {
    console.log('Received a message from RabbitMQ, preparing to send an email.');
    try {
      await this.mailerService.sendMail({
        from: this.mailConfig.from,
        to: 'test@fitfriends.local',
        subject: MailSubject.Test,
        template: MailTemplate.Test,
        context: {
          userName: emailData.userName,
          coachName: emailData.coachName,
          title: emailData.title,
          type: emailData.type,
          description: emailData.description,
          calories: emailData.calories,
        },
      });
      console.log('Email has been sent successfully.');
    }
    catch (error) {
      console.error('Failed to send email:', error);
   }
  }

  public async sendNewSubscription(email: string, userName: string, coachName: string) {
    await this.mailerService.sendMail({
      from: this.mailConfig.from,
      to: email,
      subject: MailSubject.Subscription,
      template: MailTemplate.Subscription,
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
      subject: MailSubject.Training,
      template: MailTemplate.Training,
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
