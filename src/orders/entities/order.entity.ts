import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';

@Entity()
export class Order {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  dateCreated: Date;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
