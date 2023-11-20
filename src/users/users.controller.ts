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
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { docUserService } from 'src/common/swagger/user.swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoleDefault } from 'src/common/enum';
import { SkipThrottle } from '@nestjs/throttler';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from 'src/casl/casl.factory';
import { Action } from 'src/casl/action.enum';
import { User } from './entity/user.entity';
import { IUserRoles } from 'src/common/interfaces';
import { GetUserRolesDecorator } from 'src/common/decorators';

@ApiTags('Users')
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @docUserService.create('create user')
  create(@Body() body: CreateUserDto,
    @GetUserRolesDecorator() role: IUserRoles,
  ) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.CREATE,
      new User()
    );
    return this.usersService.create(body);
  }

  @Post('root')
  @docUserService.createRoot('create user')
  createRoot() {
    return this.usersService.createRoot();
  }

  @ApiBearerAuth()
  @Get('all')
  @docUserService.findAll('get all user')
  findAll(@Req() req) {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id/get-by-id')
  @docUserService.findOne('get user by id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @Put('update-myself')
  @docUserService.updateMyself('update info myself')
  updateMyself(@Req() req, @Body() body: UpdateUserDto) {
    return this.usersService.updateMyself(req, body);
  }

  @ApiBearerAuth()
  @Get('read-myself')
  @docUserService.readMYself('read info myself')
  readMYself(@Req() req) {
    return this.usersService.readMyself(req);
  }

  @ApiBearerAuth()
  @Get('products-myself')
  @docUserService.readMYself('read info myself')
  productsMyself(@Req() req) {
    return this.usersService.readProductsMyself(req);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @docUserService.update('update user by id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @docUserService.remove('remove user by id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
