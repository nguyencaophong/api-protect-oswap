import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import { GetUserRolesDecorator } from 'src/common/decorators';
import { IUserRoles } from 'src/common/interfaces';
import { ForbiddenError } from '@casl/ability';
import { defineAbility } from 'src/casl/casl.factory';
import { Role } from './entity/role.entity';
import { Action } from 'src/casl/action.enum';
import { docRoleService } from 'src/common/swagger/role.swagger';

@ApiTags('Roles')
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @docRoleService.create('Create role')
  @Post()
  create(
    @Body() body: CreateRoleDto,
    @GetUserRolesDecorator() role: IUserRoles,
  ) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.CREATE,
      new Role(),
    );
    return this.rolesService.create(body);
  }

  @docRoleService.create('Read roles')
  @Get()
  findAll(@GetUserRolesDecorator() role: IUserRoles) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.READ,
      new Role(),
    );
    return this.rolesService.findAll();
  }

  @docRoleService.create('Update role')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
    @GetUserRolesDecorator() role: IUserRoles,
  ) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.UPDATE,
      new Role(),
    );
    return this.rolesService.update(+id, body);
  }

  @docRoleService.create('Delete role')
  @Delete(':id')
  remove(@Param('id') id: string, @GetUserRolesDecorator() role: IUserRoles) {
    ForbiddenError.from(defineAbility(role)).throwUnlessCan(
      Action.DELETE,
      new Role(),
    );
    return this.rolesService.remove(+id);
  }
}
