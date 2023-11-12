import { Process, Processor } from '@nestjs/bull';
import { EQueueName } from 'src/common/enum';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { EmailsService } from 'src/emails/emails.service';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';

@Processor(EQueueName.SEND_ORDER)
export class OrderConsumer {
  constructor(
    // ** Models
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    // ** Services
    private configService: ConfigService,
    private emailService: EmailsService,

    // ** Transactions
    private dataSource: DataSource,
  ) { }

  @Process('register')
  async sendOrder(job: Job<{ products; user }>) {
    const { products, user } = job.data;
    const queryRunner = await this.dataSource.createQueryRunner();
    const listOrderDetail: OrderDetail[] = [];
    const order = new Order();

    // ** start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ** validate products truth
      for (const product of products) {
        const productFond = await this.productRepository.findOneBy({
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
        if (
          productFond.max_number_sell !== 0 &&
          product.quantity > productFond.max_number_sell
        ) {
          throw new BadRequestException(
            `Products with id ${product.productId} can only be purchased up to ${productFond.max_number_sell} per purchase`,
          );
        }

        // ** check count order in time define
        const hoursAgoCheck = new Date();
        hoursAgoCheck.setHours(
          hoursAgoCheck.getHours() -
          this.configService.get<number>('MAX_TRANSACTION_TIME_HOURS'),
        );
        const countOrder = await this.orderRepository
          .createQueryBuilder('order')
          .where('order.dateCreated >= :hoursAgoCheck', { hoursAgoCheck })
          .getCount();
        const maxNumberTransaction = this.configService.get<number>(
          'MAX_NUMBER_TRANSACTION',
        );
        if (countOrder > maxNumberTransaction) {
          throw new BadRequestException(
            `You have exceeded your purchase count. Please try again after ${this.configService.get<string>(
              'MAX_TRANSACTION_TIME_HOURS',
            )} hours`,
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
      order.user = user;
      order.orderDetails = listOrderDetail;
      order.dateCreated = new Date();
      const newOrder = await queryRunner.manager.save(order);

      // commit transaction
      await queryRunner.commitTransaction();

      return { ...newOrder, user: user.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
