import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail, isPhone } from '../utils';

@Injectable()
export class ParseUsernamePipe implements PipeTransform<any, string> {
  transform(username: string): string {
    console.log(username);
    const isValidUsername = isEmail(username) || isPhone(username);
    if (!isValidUsername) {
      throw new BadRequestException('Username must be email or phone number');
    }
    return username;
  }
}
