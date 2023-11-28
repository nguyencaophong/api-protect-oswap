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
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { docBookService } from 'src/common/swagger/book.swagger';
import { ApiFiles } from 'src/common/interceptors/api-files.interceptor';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { ERoleDefault } from 'src/common/enum';
import { PathValidationPipe } from 'src/common/pipes';
import { Response } from 'express';
import { FindListBookDto } from './dto/find_list_book.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EActionGetBook } from 'src/common/enum/action-get-books.enum';

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
  @UseGuards(JwtAuthGuard)
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
  @docBookService.readBooksWithPagination('Get book detail with pagination')
  @Get(':id/pagination/v1')
  readBooksWithPagination(
    @Param('id', ParseIntPipe) id: number,
    @Query('path', PathValidationPipe) path: string,
    @Res() res: Response,
  ) {
    return this.booksService.findWithPagination(+id, path, res);
  }

  @Roles([ERoleDefault.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docBookService.readBooksWithPaginationV2('Get book detail with pagination V2')
  @ApiQuery({ name: 'take', type: 'number', example: 1, })
  @ApiQuery({ name: 'skip', type: 'number', example: 1, })
  @Get('pagination/v2')
  async readBooksWithPaginationV2(
    @Query() query: FindListBookDto
  ) {
    const books = await this.booksService.findWithPaginationV2(query);
    return books
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
