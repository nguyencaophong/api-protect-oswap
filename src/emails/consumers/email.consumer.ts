import { Process, Processor } from '@nestjs/bull';
import { EQueueName } from 'src/common/enum';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { emailVerifyTemplate } from '../templates';

@Processor(EQueueName.SEND_EMAIL_QUEUE)
export class EmailConsumer {
  constructor(private configService: ConfigService) { }

  @Process('register')
  async registerEmail(job: Job<unknown>) {
    const sgMail = job.data['sgMail'];
    const msg = job.data['msg'];
    const pSendEmail = job.data['pSendEmail'];

    try {
      if (this.configService.get('NODE_ENV') === 'development') {
        return msg.code;
      }
      sgMail.send({
        from: `SGOD <${this.configService.get('MAILER_ADDR')}>`,
        to: msg.email,
        subject: msg.title,
        html: emailVerifyTemplate(pSendEmail),
      });
      return 'We have sent a verification code to your email.\nPlease enter code to below.';
    } catch (err) {
      return 'Email not sent';
    }
  }
}
