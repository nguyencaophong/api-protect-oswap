import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { TAddress } from '../types';
import { ESex } from '../enum';
import { Transform } from 'class-transformer';
import { toLowerCase, trim } from 'src/common/utils';
import { IsValidUsername } from 'src/common/decorators';
import { ERoleDefault } from 'src/common/enum';

export class CreateUserDto {
  @ApiProperty({ example: 'info.account@gmail.com' })
  @Transform(({ value }) => trim(value))
  @Transform(({ value }) => toLowerCase(value))
  @IsValidUsername({ message: 'Username is in valid' })
  username: string;

  @ApiProperty({ example: 'Ptit123@' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Nguyen Cao' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Phong' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: {
      province: 'SaiGon',
      district: 'Sai Gon, Tp.ThuDuc, Tp.HCM',
      ward: 'Sai gon',
      address: 'Sai, An Phu, Tp.ThuDuc, Tp.HCM',
    },
  })
  @IsOptional()
  @IsObject()
  address: TAddress;

  @ApiProperty({ example: ESex.OTHER })
  @IsOptional()
  @IsEnum(ESex)
  sex: string;

  @ApiProperty({ type: 'enum', enum: ERoleDefault })
  @IsEnum(ERoleDefault)
  role: string;
}
