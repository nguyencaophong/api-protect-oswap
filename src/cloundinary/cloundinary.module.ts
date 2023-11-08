import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloundinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './cloundinary.controller';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule { }
