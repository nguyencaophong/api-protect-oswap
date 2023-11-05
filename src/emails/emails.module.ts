import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { Email } from './entities/email.entity';
import { BullModule } from '@nestjs/bull';
import { EQueueName } from 'src/common/enum';
import { EmailConsumer } from './consumers/email.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    BullModule.registerQueue({
      name: EQueueName.SEND_EMAIL_QUEUE,
    }),
  ],
  controllers: [EmailsController],
  providers: [EmailsService, EmailConsumer],
  exports: [EmailsService],
})
export class EmailsModule { }
