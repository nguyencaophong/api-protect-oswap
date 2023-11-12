import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    // ** Models
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    // ** Redis
    @Inject(CACHE_MANAGER) private cacheManage: Cache,
  ) { }

  async create(body: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOneBy({
      id: body.category,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = new Product();
    product.name = body.name;
    product.description = body.description;
    product.price = body.price;
    product.quantity = body.quantity;
    product.category = category;
    product.inventory = body.quantity;

    const newProduct = await this.productRepository.save(product);

    return newProduct;
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.update({ id }, <any>body);
  }

  async remove(id: number) {
    await this.productRepository.delete({ id });
  }
}
