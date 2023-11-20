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
import { GetUserRolesDecorator, Roles } from 'src/common/decorators';
import { IUserRoles } from 'src/common/interfaces';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from 'src/casl/casl.factory';
import { Action } from 'src/casl/action.enum';
import { Category } from './entities/category.entity';

@ApiTags('Category')
  @UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @docCategoryService.create('Create category ')
  create(
    @Req() req,
    @Body() body: CreateCategoryDto,
    @GetUserRolesDecorator() role: IUserRoles,
  ) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.CREATE,
      new Category(),
    );
    return this.categoriesService.create(req, body);
  }

  @Get()
  @docCategoryService.findAll('Get list category myself ')
  findAll(@GetUserRolesDecorator() role: IUserRoles) {
    console.log(role)
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.READ,
      new Category(),
    );
    return this.categoriesService.findAll();
  }

  @Patch(':id')
  @docCategoryService.update('Update category by id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @GetUserRolesDecorator() role: IUserRoles,
  ) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.UPDATE,
      new Category(),
    );
    return this.categoriesService.update(+id, body);
  }

  @Delete(':id')
  @docCategoryService.remove('Remove category by id')
  remove(@Param('id') id: string, @GetUserRolesDecorator() role: IUserRoles) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.DELETE,
      new Category(),
    );
    return this.categoriesService.remove(+id);
  }
}
