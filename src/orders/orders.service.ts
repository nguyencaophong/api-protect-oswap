import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    // ** Models
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    // ** Transactions
    private dataSource: DataSource,
  ) { }

  async create(req, body: CreateOrderDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    const listOrderDetail: OrderDetail[] = [];
    const order = new Order();

    try {
      // ** start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // ** validate products truth
      for (const product of body.products) {
        const productFond = await queryRunner.manager.findOneBy(Product, {
          id: product.productId,
        });
        if (!productFond) {
          throw new NotFoundException(
            `Can\'t find product with Id ${product.productId}`,
          );
        }
        if (product.quantity > productFond.inventory) {
          throw new BadRequestException(
            `The quantity with id ${product.productId} purchased exceeds the current inventory store.`,
          );
        }

        // ** update quantity inventory
        await queryRunner.manager.update(
          Product,
          { id: product.productId },
          { inventory: productFond.inventory - product.quantity },
        );

        // ** create list order detail
        const orderDetail = new OrderDetail();
        orderDetail.product = productFond;
        orderDetail.quantity = product.quantity;
        const newOrder = await queryRunner.manager.save(orderDetail);
        await listOrderDetail.push(newOrder);
      }

      // ** create new order
      order.user = req.user;
      order.orderDetails = listOrderDetail;
      order.dateCreated = new Date();
      const newOrder = await queryRunner.manager.save(order);

      // commit transaction
      await queryRunner.commitTransaction();

      return { ...newOrder, user: req.user.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
