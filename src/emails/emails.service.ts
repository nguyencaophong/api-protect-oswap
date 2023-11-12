import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { genCode } from 'src/common/utils';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';

import { InjectQueue } from '@nestjs/bull';
import { EQueueName } from 'src/common/enum';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { emailVerifyTemplate } from './templates';

@Injectable()
export class EmailsService {
  constructor(
    // ** Models
    @InjectRepository(Email) private emailRepository: Repository<Email>,

    // ** Services
    private configService: ConfigService,

    // ** Bull-Queue
    @InjectQueue(EQueueName.SEND_EMAIL_QUEUE)
    private sendEmailQueue: Queue, // ** Redis
  ) // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  {
    sgMail.setApiKey(
      this.configService.get('NODE_ENV') === 'production'
        ? this.configService.get('MAILER_KEY')
        : 'SG.',
    );
  }

  async sendCode(msg) {
    const pSendEmail = {
      title: 'Your code',
      subTitle:
        'Below is your code to recover your password, absolutely do not share this code with anyone:',
      value: msg.code,
    };
    await this.sendEmailQueue.add(
      'register',
      {
        sgMail,
        msg: msg,
        pSendEmail: pSendEmail,
      },
      {
        delay: 1000,
        removeOnComplete: true,
      },
    );
  }

  async verify(email: string, code: string) {
    const currentDateTimeMinus2Hours = new Date();
    currentDateTimeMinus2Hours.setHours(
      currentDateTimeMinus2Hours.getHours() - 2,
    );
    const mail = await this.emailRepository.findOneBy({
      email,
    });
    if (!mail) {
      throw new NotFoundException(
        'Code not found!\nPlease click to "Send Code".',
      );
    }
    if (mail.attempts === 0) {
      throw new BadRequestException(
        'You tried too many!\nPlease try again with a different verification code or change your email address.',
      );
    }

    const verifyCode = await bcrypt.compare(code, mail.code);
    if (verifyCode) {
      console.log('T', email);
      await this.emailRepository.delete({ email });
      return;
    } else {
      await this.emailRepository.update(
        { id: mail.id },
        { attempts: --mail.attempts },
      );

      if (mail.attempts) {
        throw new ForbiddenException(
          `Wrong code!\nYou have ${mail.attempts} attempts left.`,
        );
      } else {
        throw new BadRequestException(
          'You tried too many!\nPlease try again with a different verification code or change your email address.',
        );
      }
    }
  }

  async create(body: CreateEmailDto): Promise<{ code: string }> {
    let email = await this.emailRepository.findOneBy({
      email: body.email,
    });
    const code: string = genCode(6);
    const hashCode = await bcrypt.hash(code, await bcrypt.genSalt(10));
    const dataEmail = {
      email: body.email,
      attempts: 3,
      code: hashCode,
    };
    if (email) {
      await this.emailRepository.update({ id: email.id }, dataEmail);
    } else {
      const newEmail = new Email();
      newEmail.email = dataEmail.email;
      newEmail.attempts = dataEmail.attempts;
      newEmail.code = dataEmail.code;

      email = await this.emailRepository.save(newEmail);
    }

    const payload = {
      email: body.email,
      title: 'Verify Email',
      code,
    };
    this.sendCode(payload);
    return { code: code };
  }
}
