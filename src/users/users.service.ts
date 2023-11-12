import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';

@Injectable()
export class UsersService {
  constructor(
    // ** Models
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    // ** Services
    private readonly httpService: HttpService,
  ) { }

  async create(body: CreateUserDto) {
    const user = await new User();
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.password = body.password;
    user.address = body.address;
    user.sex = body.sex;
    user.username = body.username;
    user.role = body.role;

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const [user] = await this.userRepository.findBy({ id: id });
    return user;
  }

  async updateMyself(req, body: UpdateUserDto) {
    await this.userRepository.update({ id: req.user.id }, body);
    return this.userRepository.findOneBy({ id: req.user.id });
  }

  async readMyself(req) {
    const user = await this.userRepository.findOneBy({ id: req.user._id });
    return user;
  }

  async readProductsMyself(req) {
    const productsMyself = await this.orderRepository
      .createQueryBuilder('order')
      .where({ user: req.user.id });
  }

  update(id: number, body: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
