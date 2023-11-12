import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { toNumber } from 'src/common/utils';

type TListProduct = {
  productId: number;
  quantity: number;
};

class ProductItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: 'array', example: [{ productId: 1, quantity: 10 }] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: TListProduct[];
}
