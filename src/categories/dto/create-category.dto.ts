import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'IOT' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example:
      'It is a concept that refers to the interconnection of everyday objects and devices to the internet',
  })
  @IsOptional()
  @IsString()
  description: string;
}
