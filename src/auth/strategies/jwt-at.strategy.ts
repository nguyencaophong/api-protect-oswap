import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthStrategies extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(
    // ** Models
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // ** Services
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AT_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    const [user] = await this.userRepository.findBy({ id: payload.id });
    if (!user) {
      throw new NotFoundException('Account does not exist');
    }
    return { ...user, roles: ['User'] };
  }
}
