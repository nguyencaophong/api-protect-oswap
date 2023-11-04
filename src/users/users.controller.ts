import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { docUserService } from 'src/common/swagger/user.swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @docUserService.create('create user')
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get('all')
  @docUserService.findAll('get all user')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @docUserService.findOne('get user by id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @docUserService.update('update user by id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @docUserService.remove('remove user by id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
