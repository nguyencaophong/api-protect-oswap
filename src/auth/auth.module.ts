import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthStrategies } from './strategies/jwt-at.strategy';
import { JwtAuthGuard, LocalAuthGuard } from 'src/common/guards';
import { EmailsModule } from 'src/emails/emails.module';
import { BullModule } from '@nestjs/bull';
import { EQueueName } from 'src/common/enum';
import { AuthConsumer } from './consumers/auth.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), BullModule.registerQueue({
      name: EQueueName.RESET_STATUS_LOGIN,
    }),
    JwtModule,
    PassportModule,
    EmailsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthStrategies,
    LocalAuthGuard,
    JwtAuthGuard,
    AuthConsumer
  ],
})
export class AuthModule { }
