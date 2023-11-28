import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { toNumber } from "src/common/utils";

export class FindListBookDto {
    @IsOptional()
    @Transform(({ value }) => toNumber(value))
    @IsNumber()
    take: number

    @IsOptional()
    @Transform(({ value }) => toNumber(value))
    @IsNumber()
    skip: number
}