import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidUsername } from 'src/common/decorators';

export class LoginDto {
  @ApiProperty({ example: 'info.account@gmail.com' })
  @IsValidUsername({ message: 'Username is in valid' })
  username: string;

  @ApiProperty({ example: 'Ptit123@' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
