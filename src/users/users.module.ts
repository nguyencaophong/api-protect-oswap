import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserSubscriber } from './user.subcriber';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
})
export class UsersModule {}
