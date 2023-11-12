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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import { docOrderService } from 'src/common/swagger';
import { Throttle } from '@nestjs/throttler';
import { throttlerOptions } from 'src/common/constants';

ApiTags('Orders');
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(JwtAuthGuard)
  @docOrderService.create('Create order')
  @Throttle(throttlerOptions['order'])
  @Post()
  create(@Req() req, @Body() body: CreateOrderDto) {
    return this.ordersService.create(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @docOrderService.create('get list order')
  @Get()
  findAll(@Req() req) {
    return this.ordersService.findAll(req);
  }

  @UseGuards(JwtAuthGuard)
  @docOrderService.create('get order by Id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @docOrderService.create('update order by Id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @docOrderService.create('delete order by Id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
