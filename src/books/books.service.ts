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
import { FindListBookDto } from './dto/find_list_book.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BooksService {
  constructor(
    // ** Models
    @InjectRepository(Book) private bookRepository: Repository<Book>,

    // ** Service
    private configService: ConfigService,
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

  async findWithPagination(id: number, path: string, res: Response) {
    return res.redirect(path);
  }

  async findWithPaginationV2(query: FindListBookDto): Promise<Book[]> {
    const take: number = query.take
      ? query.take
      : this.configService.get<number>('TAKE_PAGINATION');
    const skip: number = query.skip
      ? query.skip
      : this.configService.get<number>('SKIP_PAGINATION');

    return this.bookRepository.find({
      take,
      skip,
    });
  }

  remove(id: number) {
    return this.bookRepository.delete({ id });
  }
}
