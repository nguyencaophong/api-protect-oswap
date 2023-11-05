import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { isEmail } from 'src/common/constants';
import { MatchRegex } from 'src/common/decorators';
import { toLowerCase, trim } from 'src/common/utils';

export class CreateEmailDto {
  @ApiProperty({ example: 'info.account@gmail.com' })
  @Transform(({ value }) => trim(value))
  @Transform(({ value }) => toLowerCase(value))
  @MatchRegex(isEmail, { message: 'Email is invalid format' })
  email: string;
}
