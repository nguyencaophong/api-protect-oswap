import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ default: 0 })
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @Column({ default: 1 })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @Column({ default: 0 })
  @IsNotEmpty()
  inventory: number;

  @ManyToOne(() => Category, (category) => category.products)
  @IsNotEmpty()
  category: Category;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];
}
