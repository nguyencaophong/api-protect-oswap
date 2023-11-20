import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserSubscriber } from './user.subcriber';
import { Category } from 'src/categories/entities/category.entity';
import { HttpModule } from '@nestjs/axios';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';
import { Role } from 'src/roles/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Order, Product, OrderDetail, Role]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
})
export class UsersModule {}
