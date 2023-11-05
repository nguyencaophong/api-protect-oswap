import { SetMetadata } from '@nestjs/common';
import { ERoleDefault } from '../enum';

export const ROLES_KEY = 'roles';
export const Roles = (roles: ERoleDefault[]) => SetMetadata(ROLES_KEY, roles);
