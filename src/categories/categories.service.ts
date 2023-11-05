import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class CategoriesService {
  constructor(
    // ** Models
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    // ** Manager
    private readonly entityManager: EntityManager,
  ) { }

  async create(req, body: CreateCategoryDto): Promise<Category> {
    const category = new Category();

    // ** create new category
    category.name = body.name;
    category.description = body.description;
    category.creator = req.user.id;
    const newCategory = await this.categoryRepository.save(category);
    return newCategory;
  }

  async addBook(req, id: number, bookId: number): Promise<any> {
    const hasBookExits = await this.bookRepository.findOneBy({ id: bookId });
    if (!hasBookExits) {
      throw new NotFoundException('Book not found');
    }

    const hasCategoryExits = await this.categoryRepository
      .createQueryBuilder(Category.name)
      .leftJoinAndSelect('Category.books', Book.name)
      .getOne();
    if (!hasCategoryExits) {
      throw new NotFoundException('Category not found');
    }

    const hasBookExitsInCategory = hasCategoryExits.books.find(
      (book) => book.id === bookId,
    );
    if (hasBookExitsInCategory) {
      throw new BadRequestException('Book exits in category');
    }

    hasCategoryExits.books = hasCategoryExits.books.concat([hasBookExits]);
    return this.categoryRepository.save(hasCategoryExits);
  }

  findAll(req): Promise<Category[]> {
    return this.categoryRepository.findBy({ creator: req.user.id });
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository
      .createQueryBuilder(Category.name)
      .where({ id })
      .leftJoinAndSelect('Category.books', Book.name)
      .getOne();
  }

  async update(id: number, body: UpdateCategoryDto) {
    await this.categoryRepository.update({ id }, body);
  }

  remove(id: number) {
    return this.categoryRepository.delete({ id });
  }
}
