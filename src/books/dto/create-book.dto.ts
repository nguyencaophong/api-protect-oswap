import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { toNumber } from 'src/common/utils';

export class CreateBookDto {
  @ApiProperty({
    example: 'Design pattern',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'Design patterns are general reusable solutions to common problems that occur during software design and development. ',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'PTIT',
  })
  @IsString()
  author: string;

  @ApiProperty({
    example: 100000,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'PTIT',
  })
  @IsString()
  publisher: string;

  @ApiProperty({
    type: 'array',
    example: ['Ptit', 'N19dcat060'],
    required: false,
  })
  @IsString()
  tags: string;

  images: string;
}
