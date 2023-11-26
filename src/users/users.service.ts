import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(body: CreateUserDto) {
    const user = await new User();
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.password = body.password;
    user.address = body.address;
    user.sex = body.sex;
    user.username = body.username;
    user.role = body.role

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const [user] = await this.userRepository.findBy({ id: id });
    return user;
  }

  update(id: number, body: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
