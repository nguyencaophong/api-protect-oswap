import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ESex } from '../enum/sex.enum';
import { TAddress } from '../types';
import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Role } from 'src/roles/entity/role.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ select: false })
  password: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ type: String })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: ESex, default: ESex.OTHER, nullable: true })
  sex: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  address: TAddress;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty()
  @OneToOne(type => Role)
  @JoinColumn()
  role: Role;

  @OneToMany(() => Category, (category) => category.creator)
  categories: Category[]; 

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
