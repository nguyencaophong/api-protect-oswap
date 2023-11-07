import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Response } from 'express';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) { }

  async create(
    images: Express.Multer.File[],
    body: CreateBookDto,
  ): Promise<Book> {
    const imagesUrl: string[] = [];
    const book = new Book();
    if (!!images.length) {
      for (const image of images) {
        imagesUrl.push(image.filename);
      }
    }

    book.name = body.name;
    book.description = body.description;
    book.author = body.author;
    book.price = body.price;
    book.publisher = body.publisher;
    book.tags = body.tags;
    book.images = imagesUrl;
    const newBook = await this.bookRepository.save(book);
    return newBook;
  }

  getBookMyStore() {
    // const hasBookExits = await this.bookRepository.findOneBy({ id })
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository
      .createQueryBuilder(Book.name)
      .where({ id })
      .leftJoinAndSelect('Book.categories', Category.name)
      .getOne();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async findWithPagination(
    id: number,
    action: string,
    path: string,
    res: Response,
  ) {
    const bookPresent = await this.bookRepository
      .createQueryBuilder(Book.name)
      .where({ id })
      .leftJoinAndSelect('Book.categories', Category.name)
      .getOne();

    return res.redirect(path);
  }

  // update(id: number, body: UpdateBookDto): Promise<Book> { }

  remove(id: number) {
    return this.bookRepository.delete({ id });
  }
}
