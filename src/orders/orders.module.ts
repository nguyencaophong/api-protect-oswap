import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { BullModule } from '@nestjs/bull';
import { EQueueName } from 'src/common/enum';
import { OrderConsumer } from './consumers/order.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderDetail]),
    EmailsModule,
    BullModule.registerQueue({
      name: EQueueName.SEND_ORDER,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConsumer],
})
export class OrdersModule { }
