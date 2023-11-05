import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { isCodeVerify } from 'src/common/constants';
import { MatchRegex } from 'src/common/decorators';

export class ResetPasswordDto {
  @ApiProperty({ example: '534233' })
  @MatchRegex(isCodeVerify, { message: 'Code verify include 6 numeric' })
  code: string;

  @ApiProperty({ example: 'Ptit123@' })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
