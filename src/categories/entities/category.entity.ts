import { ApiProperty } from '@nestjs/swagger';
import { Book } from 'src/books/entities/book.entity';
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

@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.categories)
  creator: User;

  // @ManyToMany(() => Book, (book) => book.categories)
  // @JoinTable()
  // books: Book[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
