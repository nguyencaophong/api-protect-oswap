import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>) { }

  async create(body: CreateRoleDto): Promise<Role> {
    const role = new Role()
    role.name = body.name;
    role.description = body.description;
    role.permissions = body.permissions;

    const newRole = await this.roleRepository.save(role);
    return newRole;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.roleRepository.find();
    return roles.filter(role => role.name !== 'Root')
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id: id })
    if (!role) {
      throw new NotFoundException("Role not found")
    }
    return role;
  }

  async update(id: number, body: UpdateRoleDto) {
    const role = await this.roleRepository.findOneBy({ id: id })
    if (!role) {
      throw new NotFoundException("Role not found")
    }
    const roleUpdated = await this.roleRepository.update({ id }, body)
    return roleUpdated;
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOneBy({ id: id })
    if (!role) {
      throw new NotFoundException("Role not found")
    }
    return this.roleRepository.delete({ id })
  }
}
