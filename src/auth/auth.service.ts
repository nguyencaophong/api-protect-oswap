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

@Injectable()
export class AuthService {
  constructor(
    // ** Models
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // ** Services
    private configService: ConfigService,
    private jwtService: JwtService,
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
    const hasUserExits = await this.userRepository.findOneBy({
      username: username,
    });
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

  resetPassword() { }
}
