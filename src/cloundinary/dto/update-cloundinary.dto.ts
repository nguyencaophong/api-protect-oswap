import { PartialType } from '@nestjs/swagger';
import { CreateCloundinaryDto } from './create-cloundinary.dto';

export class UpdateCloundinaryDto extends PartialType(CreateCloundinaryDto) {}
