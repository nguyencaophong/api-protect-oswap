import {
  BadRequestException,
  ForbiddenException,
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

import { emailVerifyTemplate } from './templates';

@Injectable()
export class EmailsService {
  constructor(
    // ** Models
    @InjectRepository(Email) private emailRepository: Repository<Email>,

    // ** Services
    private configService: ConfigService,
  ) {
    sgMail.setApiKey(
      this.configService.get('NODE_ENV') === 'production'
        ? this.configService.get('MAILER_KEY')
        : 'SG.',
    );
  }

  sendCode(msg) {
    const PEmail = {
      title: 'Your code',
      subTitle:
        'Below is your code to recover your password, absolutely do not share this code with anyone:',
      value: msg.code,
    };
    try {
      if (this.configService.get('NODE_ENV') === 'development') {
        return msg.code;
      }
      sgMail.send({
        from: `SGOD <${this.configService.get('MAILER_ADDR')}>`,
        to: msg.email,
        subject: msg.title,
        html: emailVerifyTemplate(PEmail),
      });
      return 'We have sent a verification code to your email.\nPlease enter code to below.';
    } catch (err) {
      return 'Email not sent';
    }
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
    const msg = this.sendCode(payload);
    return { code: msg };
  }
}
