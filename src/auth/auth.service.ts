import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto';
import { isEmail, isPhone } from 'src/common/utils';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    // ** Models
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // ** Services
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailsService,
  ) { }

  async genTokens(payload: { id: number }) {
    const accessSecret = this.configService.get<string>('AT_SECRET');
    const refreshSecret = this.configService.get<string>('RT_SECRET');

    const accessToken = await this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: this.configService.get('EX_AT_SECRET'),
    });

    const refreshToken = await this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: this.configService.get('EX_RT_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  async validate(username: string, password: string): Promise<User> {
    const hasUserExits = await this.userRepository
      .createQueryBuilder('User')
      .addSelect('User.password')
      .where({ username })
      .getOne();
    if (!hasUserExits) {
      throw new NotFoundException('Account not exits');
    }

    const isValidPassword = await bcrypt.compare(
      password,
      hasUserExits.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Username or password not incorrect');
    }

    if (hasUserExits) return hasUserExits;
    else return null;
  }

  async login(req): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id: req.user.id,
    };
    const { accessToken, refreshToken } = await this.genTokens(payload);
    await this.userRepository.update({ id: req.user.id }, { refreshToken });
    return { accessToken, refreshToken };
  }

  async logout(req) {
    await this.userRepository.update(
      { id: req.user.id },
      { refreshToken: null },
    );
  }

  async resetPassword(username: string, body: ResetPasswordDto) {
    const hasUserExits = await this.userRepository.findOneBy({ username });
    if (!hasUserExits) {
      throw new NotFoundException('Email or phone not registered.');
    }
    if (isEmail(username)) {
      await this.emailService.verify(username, body.code);
    }
    if (isPhone(username)) {
      // await this.phoneService.verify(username, body.code);
    }

    const hashPassword = await bcrypt.hash(body.new_password, 10);
    await this.userRepository.update({ username }, { password: hashPassword });
  }
}
