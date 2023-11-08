import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { EActionGetBook } from '../enum';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class ParseActionPipe implements PipeTransform<any, string> {
  transform(action: string): string {
    if (!Object.values(EActionGetBook).includes(action as EActionGetBook)) {
      throw new BadRequestException(
        'Action must be: next_page or previous_page',
      );
    }
    return action;
  }
}
