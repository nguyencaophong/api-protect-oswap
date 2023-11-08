import {
  BadRequestException,
  Inject,
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
import { isEmail, isPhone, toString } from 'src/common/utils';
import { EmailsService } from 'src/emails/emails.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EKeyPrefixRedis, EQueueName } from 'src/common/enum';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AuthService {
  private static POSSIBLE_LOGIN_ATTEMPTS = 5;
  private static LOGIN_STATUS_RESET_TIME = 300000;
  constructor(
    // ** Models
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // ** Services
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailsService,

    // ** Redis 
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    // ** Bull-Queue
    @InjectQueue(EQueueName.RESET_STATUS_LOGIN)
    private resetStatusLoginQueue: Queue,
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

    const numberLoginFailed = await this.cacheManager.get<number>(toString(`${hasUserExits.id}-${EKeyPrefixRedis.LOGIN_FAILED}`)) || 0;
    if (numberLoginFailed + 1 === AuthService.POSSIBLE_LOGIN_ATTEMPTS + 1) {
      throw new BadRequestException('Entered incorrectly more than 5 times. Please wait 5 minutes and try again')
    }

    const isValidPassword = await bcrypt.compare(
      password,
      hasUserExits.password,
    );
    if (!isValidPassword) {
      await this.cacheManager.set(toString(`${hasUserExits.id}-${EKeyPrefixRedis.LOGIN_FAILED}`), numberLoginFailed + 1)
      if (numberLoginFailed + 1 === AuthService.POSSIBLE_LOGIN_ATTEMPTS) {
        this.resetStatusLoginQueue.add('reset-status-login',
          { id: hasUserExits.id },
          { delay: AuthService.LOGIN_STATUS_RESET_TIME, removeOnComplete: true })
      }
      throw new BadRequestException('Username or password not incorrect');
    }

    if (!hasUserExits.isActive) {
      throw new BadRequestException("Your account has been blocked. Please contact the administrator to open")
    }

    return hasUserExits
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
