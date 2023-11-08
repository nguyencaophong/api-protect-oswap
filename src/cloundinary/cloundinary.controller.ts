import { Body, Controller, Get, Post, Query, UploadedFile } from '@nestjs/common';
import { ApiFile } from 'src/common/interceptors';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloundinary.service';
import { CreateCloundinaryDto } from './dto/create-cloundinary.dto';
import { docCloundinaryService } from 'src/common/swagger/cloudinary.swagger';

@ApiTags('Uploads')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @docCloundinaryService.create('Upload avatar')
  @Post()
  create(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: CreateCloundinaryDto,
  ) {
    return this.cloudinaryService.uploadImage(avatar);
  }

  @docCloundinaryService.create('Upload avatar')
  @ApiQuery({ name: 'imageUrl', example: 'http://cloundinary/images/erwi32klsd' })
  @Get('image')
  getImageInfoFromUrl(@Query('imageUrl') imageUrl: string) {
    return this.cloudinaryService.getImageInfoFromUrl(imageUrl);
  }
}
