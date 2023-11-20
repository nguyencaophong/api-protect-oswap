import { Types } from 'mongoose';
import { IPermission } from './permission.interface';

export interface IUserRoles {
  name: string;
  permissions: IPermission[];
  id?: string | Types.ObjectId;
}
