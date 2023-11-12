import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { docCategoryService } from 'src/common/swagger/category.swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { ERoleDefault } from 'src/common/enum';

@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @docCategoryService.create('Create category ')
  create(@Req() req, @Body() body: CreateCategoryDto) {
    return this.categoriesService.create(req, body);
  }

  // @Put(':id/add-books/:bookId')
  // @docCategoryService.create('Add book into category ')
  // addBook(
  //   @Req() req,
  //   @Param('id') id: number,
  //   @Param('bookId') bookId: number,
  // ) {
  //   return this.categoriesService.addBook(req, id, bookId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  @docCategoryService.findAll('Get list category myself ')
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @docCategoryService.findOne('Get category by id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @docCategoryService.update('Update category by id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(+id, body);
  }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @docCategoryService.remove('Remove category by id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
