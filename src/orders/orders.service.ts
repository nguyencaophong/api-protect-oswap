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
import { ConfigService } from '@nestjs/config';
import { EmailsService } from 'src/emails/emails.service';

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

    // ** Services
    private configService: ConfigService,
    private emailService: EmailsService,

    // ** Transactions
    private dataSource: DataSource,
  ) { }

  async create(req, body: CreateOrderDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    const listOrderDetail: OrderDetail[] = [];
    const order = new Order();

    // ** verify code
    await this.emailService.verify(req.user.username, body.code);

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
        const maxNumberTransaction = this.configService.get<number>(
          'MAX_NUMBER_TRANSACTION',
        );
        const maxTimeTransaction = this.configService.get<number>('MAX_TRANSACTION_TIME_HOURS');

        hoursAgoCheck.setHours(
          hoursAgoCheck.getHours() - maxTimeTransaction,
        );

        const countOrder = await this.orderRepository
          .createQueryBuilder('order')
          .where('order.dateCreated >= :hoursAgoCheck', { hoursAgoCheck })
          .getCount();

        if (countOrder > maxNumberTransaction) {
          throw new BadRequestException(
            `You have exceeded your purchase count. Please try again after ${maxTimeTransaction} hours`,
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

  findAll(req): Promise<Order[]> {
    return this.orderRepository.findBy({ user: req.user.id });
  }

  async findOne(id: number): Promise<any> {
    return await this.orderDetailRepository
      .createQueryBuilder(OrderDetail.name)
      .where({ order: id })
      .leftJoinAndSelect('OrderDetail.product', Product.name)
      .getMany();
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
