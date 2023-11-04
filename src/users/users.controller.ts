import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { docUserService } from 'src/common/swagger/user.swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoleDefault } from 'src/common/enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @docUserService.create('create user')
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @ApiBearerAuth()
  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  @docUserService.findAll('get all user')
  findAll(@Req() req) {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @docUserService.findOne('get user by id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @docUserService.update('update user by id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles([ERoleDefault.ADMIN, ERoleDefault.ROOT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @docUserService.remove('remove user by id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
