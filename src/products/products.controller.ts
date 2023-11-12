import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { ERoleDefault } from 'src/common/enum';
import { docProductService } from 'src/common/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    // ** Services
    private readonly productsService: ProductsService,
  ) { }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docProductService.create('create product')
  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @docProductService.create('get list product')
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @docProductService.create('get product by Id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docProductService.create('update product by Id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(+id, body);
  }

  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @docProductService.create('delete product by Id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
