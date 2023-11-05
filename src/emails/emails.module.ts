import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule { }
