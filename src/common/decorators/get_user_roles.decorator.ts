import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPermission, IUserRoles } from '../interfaces';
import { permissionJSON } from 'configs';

export const GetUserRolesDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let permissions: IPermission[] = [];
    const permissionUserPresent = request.user.role.permissions;

    if (!!permissionUserPresent?.length) {
      for (const p of permissionUserPresent) {
        const permissionFound = permissionJSON.find(item => item._id === p);
        permissions.push(permissionFound)
      }
    }
    request.user.role.permissions = permissions;
    return request?.user?.role ?? null;
  },
);
