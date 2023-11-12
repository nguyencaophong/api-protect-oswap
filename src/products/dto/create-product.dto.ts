import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { toNumber } from 'src/common/utils';

export class CreateProductDto {
  @ApiProperty({ example: 'Product 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Product 1 description' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 100000 })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  price: number;

  @ApiProperty()
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  category: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  max_number_sell: number;
}
