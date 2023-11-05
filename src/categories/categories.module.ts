import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { User } from 'src/users/entity/user.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, Book])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
