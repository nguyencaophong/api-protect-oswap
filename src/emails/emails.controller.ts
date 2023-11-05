import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmailDto } from './dto/create-email.dto';
import { Throttle } from '@nestjs/throttler';
import { throttlerOptions } from 'src/common/constants';

@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Throttle(throttlerOptions['medium'])
  @Post('gen-code')
  create(@Body() body: CreateEmailDto) {
    return this.emailsService.create(body);
  }
}
