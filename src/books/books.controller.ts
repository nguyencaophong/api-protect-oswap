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
  ParseIntPipe,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { docBookService } from 'src/common/swagger/book.swagger';
import { ApiFiles } from 'src/common/interceptors/api-files.interceptor';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { EActionGetBook, ERoleDefault } from 'src/common/enum';
import { ParseActionPipe } from 'src/common/pipes';
import { Response } from 'express';

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
  @docBookService.findOne('Get book by Id')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(+id);
  }

  @Roles([ERoleDefault.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docBookService.findOne('Get book detail with pagination')
  @ApiParam({ name: 'action', type: 'enum', enum: EActionGetBook })
  @Get(':id/:action')
  readBooksWithPagination(
    @Param('id', ParseIntPipe) id: number,
    @Param('action', ParseActionPipe) action: string,
    @Query('path') path: string,
    @Res() res: Response,
  ) {
    return this.booksService.findWithPagination(+id, action, path, res);
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
