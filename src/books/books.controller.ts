import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { docBookService } from 'src/common/swagger/book.swagger';
import { ApiFiles } from 'src/common/interceptors/api-files.interceptor';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { ERoleDefault } from 'src/common/enum';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @ApiConsumes('multipart/form-data')
  @ApiFiles('images')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Design pattern' },
        description: {
          type: 'string',
          example:
            'Design patterns are general reusable solutions to common problems that occur during software design and development. ',
        },
        author: {
          type: 'string',
          example: 'PTIT',
        },
        price: {
          type: 'integer',
          example: 100000,
        },
        publisher: {
          type: 'string',
          example: 'PTIT',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            example: 'PTIT',
          },
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docBookService.create('Create book')
  @Post()
  create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: CreateBookDto,
  ) {
    return this.booksService.create(images, body);
  }

  @docBookService.findAll('Get list boos')
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Roles([ERoleDefault.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docBookService.findOne('Get book detail')
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @docBookService.update('Update book by Id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBookDto) {
    // return this.booksService.update(+id, body);
  }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docBookService.remove('Delete book by Id (manager role)')
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
