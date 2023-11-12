import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EStatusBook } from '../book.enum';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Book {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: EStatusBook, default: EStatusBook.SHOW })
  status: string;

  @ApiProperty()
  @Column()
  author: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  publisher: string;

  @ApiProperty()
  @Column('simple-array')
  tags: string;

  @ApiProperty()
  @Column('simple-array')
  images: string[];

  // @ManyToMany(() => Category, (category) => category.books, {
  //   onDelete: 'CASCADE',
  // })
  // categories: Category[];
}
